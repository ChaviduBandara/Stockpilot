package com.stockpilot.service.impl;

import com.stockpilot.dto.DashboardSummary;
import com.stockpilot.entity.OrderStatus;
import com.stockpilot.repository.CategoryRepository;
import com.stockpilot.repository.CustomerRepository;
import com.stockpilot.repository.ProductRepository;
import com.stockpilot.repository.SalesOrderRepository;
import com.stockpilot.repository.SupplierRepository;
import com.stockpilot.service.DashboardService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final CustomerRepository customerRepository;
    private final SalesOrderRepository salesOrderRepository;

    public DashboardServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            SupplierRepository supplierRepository,
            CustomerRepository customerRepository,
            SalesOrderRepository salesOrderRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.customerRepository = customerRepository;
        this.salesOrderRepository = salesOrderRepository;
    }

    @Override
    public DashboardSummary getSummary() {

        long totalProducts = productRepository.count();

        long lowStockProducts = productRepository.countLowStockProducts();

        long totalCategories = categoryRepository.count();

        long totalSuppliers = supplierRepository.count();

        long totalCustomers = customerRepository.count();

        long totalOrders = salesOrderRepository.count();

        long completedOrders = salesOrderRepository.countByStatus(
                        OrderStatus.COMPLETED
                );

        long cancelledOrders = salesOrderRepository.countByStatus(
                        OrderStatus.CANCELLED
                );

        BigDecimal totalRevenue = salesOrderRepository.sumTotalAmountByStatus(
                        OrderStatus.COMPLETED
                );

        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        return new DashboardSummary(
                totalProducts,
                lowStockProducts,
                totalCategories,
                totalSuppliers,
                totalCustomers,
                totalOrders,
                completedOrders,
                cancelledOrders,
                totalRevenue
        );
    }
}