package com.info5059.casestudy.purchaseorder;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    // will return the number of rows deleted
    @Transactional
    @Query("delete from Product where id = ?1")
    int deleteOne(Long poid);

    List<PurchaseOrder> findByVendorid(Long vendorid);
}
