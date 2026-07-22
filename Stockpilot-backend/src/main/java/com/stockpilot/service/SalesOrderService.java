package com.stockpilot.service;

import com.stockpilot.dto.SalesOrderRequest;
import com.stockpilot.entity.SalesOrder;

import java.util.List;

public interface SalesOrderService {

    SalesOrder createOrder(SalesOrderRequest request);

    List<SalesOrder> getAllOrders();

    SalesOrder getOrderById(Long id);
}