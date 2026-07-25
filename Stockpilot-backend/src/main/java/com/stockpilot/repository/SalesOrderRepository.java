package com.stockpilot.repository;

import com.stockpilot.entity.OrderStatus;
import com.stockpilot.entity.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalesOrderRepository
        extends JpaRepository<SalesOrder, Long> {

    List<SalesOrder> findByCustomerIdOrderByOrderDateDesc(
            Long customerId
    );

    List<SalesOrder> findByStatusOrderByOrderDateDesc(
            OrderStatus status
    );
}