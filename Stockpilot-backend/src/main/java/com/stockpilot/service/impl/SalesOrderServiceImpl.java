package com.stockpilot.service.impl;

import com.stockpilot.dto.OrderItemRequest;
import com.stockpilot.dto.SalesOrderRequest;
import com.stockpilot.entity.*;
import com.stockpilot.repository.CustomerRepository;
import com.stockpilot.repository.ProductRepository;
import com.stockpilot.repository.SalesOrderRepository;
import com.stockpilot.service.SalesOrderService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.stockpilot.entity.OrderStatus;
import com.stockpilot.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SalesOrderServiceImpl implements SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public SalesOrderServiceImpl(
            SalesOrderRepository salesOrderRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository
    ) {
        this.salesOrderRepository = salesOrderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public SalesOrder createOrder(SalesOrderRequest request) {

        Customer customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Order must contain at least one item"
            );
        }

        SalesOrder salesOrder = new SalesOrder();

        salesOrder.setCustomer(customer);
        salesOrder.setOrderDate(LocalDateTime.now());
        salesOrder.setStatus(OrderStatus.PENDING);
        salesOrder.setPaymentStatus(PaymentStatus.UNPAID);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {

            if (itemRequest.getQuantity() == null ||
                    itemRequest.getQuantity() <= 0) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Product quantity must be greater than zero"
                );
            }

            Product product = productRepository
                    .findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Product not found: " + itemRequest.getProductId()
                    ));

            if (product.getQuantity() < itemRequest.getQuantity()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Insufficient stock for product: " + product.getName()
                );
            }

            BigDecimal unitPrice = product.getPrice();

            BigDecimal subtotal = unitPrice.multiply(
                    BigDecimal.valueOf(itemRequest.getQuantity())
            );

            SalesOrderItem orderItem = new SalesOrderItem();

            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(unitPrice);
            orderItem.setSubtotal(subtotal);

            salesOrder.addItem(orderItem);

            product.setQuantity(
                    product.getQuantity() - itemRequest.getQuantity()
            );

            productRepository.save(product);

            totalAmount = totalAmount.add(subtotal);
        }

        salesOrder.setTotalAmount(totalAmount);

        return salesOrderRepository.save(salesOrder);
    }

    @Override
    public List<SalesOrder> getAllOrders() {
        return salesOrderRepository.findAll();
    }

    @Override
    public SalesOrder getOrderById(Long id) {
        return salesOrderRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public SalesOrder cancelOrder(Long id) {

        SalesOrder salesOrder = salesOrderRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Sales order not found"
                ));

        if (salesOrder.getStatus() == OrderStatus.CANCELLED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Sales order is already cancelled"
            );
        }

        for (SalesOrderItem item : salesOrder.getItems()) {

            Product product = item.getProduct();

            product.setQuantity(
                    product.getQuantity() + item.getQuantity()
            );

            productRepository.save(product);
        }

        salesOrder.setStatus(OrderStatus.CANCELLED);

        return salesOrderRepository.save(salesOrder);
    }

    @Override
    public List<SalesOrder> getOrdersByCustomer(Long customerId) {

        if (!customerRepository.existsById(customerId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Customer not found"
            );
        }

        return salesOrderRepository
                .findByCustomerIdOrderByOrderDateDesc(customerId);
    }

    @Override
    public List<SalesOrder> getOrdersByStatus(OrderStatus status) {
        return salesOrderRepository
                .findByStatusOrderByOrderDateDesc(status);
    }

    @Override
    @Transactional
    public SalesOrder markOrderAsPaid(Long id) {
        SalesOrder salesOrder = salesOrderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Sales order not found"
                ));

        if (salesOrder.getStatus() == OrderStatus.CANCELLED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A cancelled order cannot be paid"
            );
        }

        if (salesOrder.getPaymentStatus() == PaymentStatus.PAID) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The order has already been paid"
            );
        }

        salesOrder.setPaymentStatus(PaymentStatus.PAID);
        salesOrder.setStatus(OrderStatus.PROCESSING);

        return salesOrderRepository.save(salesOrder);
    }

    @Override
    @Transactional
    public SalesOrder completeOrder(Long id) {
        SalesOrder salesOrder = salesOrderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Sales order not found"
                ));

        if (salesOrder.getStatus() == OrderStatus.CANCELLED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A cancelled order cannot be completed"
            );
        }

        if (salesOrder.getPaymentStatus() != PaymentStatus.PAID) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The order must be paid before it can be completed"
            );
        }

        if (salesOrder.getStatus() == OrderStatus.COMPLETED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The order is already completed"
            );
        }

        salesOrder.setStatus(OrderStatus.COMPLETED);

        return salesOrderRepository.save(salesOrder);
    }
}