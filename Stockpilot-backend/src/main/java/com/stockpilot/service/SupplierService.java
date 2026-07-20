package com.stockpilot.service;

import com.stockpilot.entity.Supplier;

import java.util.List;

public interface SupplierService {

    Supplier addSupplier(Supplier supplier);

    List<Supplier> getAllSuppliers();

    Supplier getSupplierById(Long id);

    Supplier updateSupplier(Long id, Supplier supplier);

    void deleteSupplier(Long id);
}