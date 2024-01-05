package com.info5059.casestudy.vendor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class VendorController {
    @Autowired
    private VendorRepository VendorRepository;

    @GetMapping("/api/vendors")
    public ResponseEntity<Iterable<Vendor>> findAll() {
        Iterable<Vendor> vendors = VendorRepository.findAll();
        return new ResponseEntity<Iterable<Vendor>>(vendors, HttpStatus.OK);
    }

    @PutMapping("/api/vendors")
    public ResponseEntity<Vendor> updateOne(@RequestBody Vendor vendor) {
        Vendor updatedVendor = VendorRepository.save(vendor);
        return new ResponseEntity<Vendor>(updatedVendor, HttpStatus.OK);
    }

    @PostMapping("/api/vendors")
    public ResponseEntity<Vendor> addOne(@RequestBody Vendor vendor) {
        Vendor newVendor = VendorRepository.save(vendor);
        return new ResponseEntity<Vendor>(newVendor, HttpStatus.OK);
    }

    @DeleteMapping("/api/vendors/{id}")
    public ResponseEntity<Integer> deleteOne(@PathVariable long id) {
        return new ResponseEntity<Integer>(VendorRepository.deleteOne(id), HttpStatus.OK);
    }

}
