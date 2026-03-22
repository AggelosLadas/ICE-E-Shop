package com.aggelosladas.ICE.E_Shop.Controllers;

import com.aggelosladas.ICE.E_Shop.DTOs.AddProductDTO;
import com.aggelosladas.ICE.E_Shop.Models.Product;
import com.aggelosladas.ICE.E_Shop.Repositories.ProductRepository;
import com.aggelosladas.ICE.E_Shop.Services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService productService;
    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public void uploadProduct(@RequestBody AddProductDTO addProductDTO) {
        productService.addProduct(addProductDTO);
    }

    @PostMapping("/find")
    public Optional<Product> searchByCode(@RequestParam int code){
        return productService.findByProductCode(code);
    }

    @GetMapping("/showAll")
    public List<Product> showAll(){
        return productService.showAll();
    }

    @GetMapping("/showAllByNamesAsc")
    public List<Product> showAllByOrderByProductNameAsc(){
        return productService.showAllByOrderByProductNameAsc();
    }

    @GetMapping("/showAllByPriceAsc")
    public List<Product> showAllByOrderByPriceAsc(){
        return productService.showAllByOrderByProductPriceAsc();
    }

    @GetMapping("/showAllByPriceDesc")
    public List<Product> showAllByOrderByPriceDesc(){
        return productService.showAllByOrderByProductPriceDesc();
    }

    @DeleteMapping("/{productCode}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProduct(@PathVariable int productCode) {
        productService.deleteByProductCode(productCode);
    }

}
