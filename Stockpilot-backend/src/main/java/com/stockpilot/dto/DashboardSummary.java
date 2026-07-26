package com.stockpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class DashboardSummary {

    private long totalProducts;
    private long lowStockProducts;
    private long totalCategories;
    private long totalSuppliers;
    private long totalCustomers;
    private long totalOrders;
    private long completedOrders;
    private long cancelledOrders;
    private BigDecimal totalRevenue;
}