package com.stockpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {

    private String name;
    private String sku;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private Integer reorderLevel;
    private Long categoryId;
}