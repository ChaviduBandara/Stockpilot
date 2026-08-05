package com.stockpilot.repository;

import com.stockpilot.entity.OrderStatus;
import com.stockpilot.entity.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.stockpilot.entity.PaymentStatus;

import java.math.BigDecimal;
import java.util.List;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

    List<SalesOrder> findByCustomerIdOrderByOrderDateDesc(Long customerId);

    List<SalesOrder> findByStatusOrderByOrderDateDesc(OrderStatus status);

    long countByStatus(OrderStatus status);

    @Query("""
        SELECT SUM(o.totalAmount)
        FROM SalesOrder o
        WHERE o.status = :status
        """)
    BigDecimal sumTotalAmountByStatus(
            @Param("status") OrderStatus status
    );

    @Query("""
    SELECT COALESCE(SUM(o.totalAmount), 0)
    FROM SalesOrder o
    WHERE o.paymentStatus = :paymentStatus
""")
    BigDecimal sumTotalAmountByPaymentStatus(
            @Param("paymentStatus") PaymentStatus paymentStatus
    );
}