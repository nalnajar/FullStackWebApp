package com.info5059.casestudy.purchaseorder;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDateTime;

@Component
public class PurchaseOrderDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public PurchaseOrder create(PurchaseOrder clientrep) {
        PurchaseOrder realPurchaseOrder = new PurchaseOrder();
        realPurchaseOrder.setpodate(LocalDateTime.now());
        realPurchaseOrder.setVendorid(clientrep.getVendorid());
        realPurchaseOrder.setAmount(clientrep.getAmount());
        entityManager.persist(realPurchaseOrder);
        for (PurchaseOrderLineitem item : clientrep.getItems()) {
            PurchaseOrderLineitem realItem = new PurchaseOrderLineitem();
            realItem.setPurchaseOrderid(realPurchaseOrder.getId());
            realItem.setProductid(item.getProductid());
            realItem.setProductName(item.getProductName());
            realItem.setPrice(item.getPrice());
            realItem.setQty(item.getQty());
            entityManager.persist(realItem);
        }
        entityManager.refresh(realPurchaseOrder);
        return realPurchaseOrder;
    }
}
