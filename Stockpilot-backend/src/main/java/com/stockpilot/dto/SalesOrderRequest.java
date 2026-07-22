package com.stockpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SalesOrderRequest {

    private Long customerId;
    private List<OrderItemRequest> items;
}