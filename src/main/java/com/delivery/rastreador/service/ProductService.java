package com.delivery.rastreador.service;

import com.delivery.rastreador.dto.ProductResponseDTO;
import com.delivery.rastreador.exception.ResourceNotFoundException;
import com.delivery.rastreador.model.Product;
import com.delivery.rastreador.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponseDTO> findAll() {
        return productRepository.findAllByOrderByCategoryAscNameAsc()
                .stream()
                .map(ProductResponseDTO::new)
                .toList();
    }

    public ProductResponseDTO findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
        return new ProductResponseDTO(product);
    }
}
