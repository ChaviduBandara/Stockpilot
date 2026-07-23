package com.stockpilot.service.impl;

import com.stockpilot.entity.Customer;
import com.stockpilot.repository.CustomerRepository;
import com.stockpilot.service.CustomerService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public Customer addCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id).orElse(null);
    }

    @Override
    public Customer updateCustomer(Long id, Customer customer
    ) {
        Customer existingCustomer = customerRepository.findById(id).orElse(null);

        if (existingCustomer == null) {
            return null;
        }

        existingCustomer.setName(customer.getName());
        existingCustomer.setEmail(customer.getEmail());
        existingCustomer.setContactNumber(customer.getContactNumber());
        existingCustomer.setAddress(customer.getAddress());

        return customerRepository.save(existingCustomer);
    }

    @Override
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}