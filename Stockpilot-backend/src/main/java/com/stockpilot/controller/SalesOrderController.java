package com.stockpilot.controller;

import com.stockpilot.dto.SalesOrderRequest;
import com.stockpilot.entity.SalesOrder;
import com.stockpilot.service.SalesOrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class SalesOrderController {

    private final SalesOrderService salesOrderService;

    public SalesOrderController(SalesOrderService salesOrderService) {
        this.salesOrderService = salesOrderService;
    }

    @PostMapping
    public ResponseEntity<SalesOrder> createOrder(@RequestBody SalesOrderRequest request) {
        SalesOrder savedOrder = salesOrderService.createOrder(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedOrder);
    }

    @GetMapping
    public List<SalesOrder> getAllOrders() {
        return salesOrderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalesOrder> getOrderById(@PathVariable Long id) {
        SalesOrder salesOrder =
                salesOrderService.getOrderById(id);

        if (salesOrder == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(salesOrder);
    }
}