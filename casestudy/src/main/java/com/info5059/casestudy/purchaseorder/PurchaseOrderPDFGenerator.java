package com.info5059.casestudy.purchaseorder;

import com.info5059.casestudy.vendor.Vendor;
import com.info5059.casestudy.vendor.VendorRepository;
import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;
import com.info5059.casestudy.pdfexample.Generator;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

import net.bytebuddy.dynamic.loading.PackageDefinitionStrategy.Definition.Undefined;

import org.springframework.web.servlet.view.document.AbstractPdfView;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.net.URL;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.time.LocalDateTime;
import com.info5059.casestudy.product.QRCodeGenerator;

/**
 * PurchaseOrderPDFGenerator - a class for creating dynamic product
 * purchaseorder output in
 * PDF format using the iText 7 library
 *
 * @author Evan
 */
public abstract class PurchaseOrderPDFGenerator extends AbstractPdfView {

        public static byte[] qrcodebin = null;

        public static ByteArrayInputStream generatePurchaseOrder(String poid,
                        PurchaseOrderRepository purchaseorderRepository,
                        VendorRepository vendorRepository,
                        ProductRepository productRepository) throws IOException {

                URL imageUrl = Generator.class.getResource("/static/images/Vendors.jpg");
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                PdfWriter writer = new PdfWriter(baos);
                // Initialize PDF document to be written to a stream not a file
                PdfDocument pdf = new PdfDocument(writer);
                // Document is the main object
                Document document = new Document(pdf);
                PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
                // add the image to the document
                PageSize pg = PageSize.A4;
                Image img = new Image(ImageDataFactory.create(imageUrl)).scaleAbsolute(120, 120)
                                // .setFixedPosition(pg.getWidth() / 2 - 60, 750)
                                .setTextAlignment(TextAlignment.LEFT);
                document.add(img);
                // now let's add a big heading
                // document.add(new Paragraph("\n\n"));
                Locale locale = new Locale("en", "US");
                NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);

                try {
                        // document.add(new Paragraph("\n"));
                        Optional<PurchaseOrder> optPurchaseOrder = purchaseorderRepository
                                        .findById(Long.parseLong(poid));
                        if (optPurchaseOrder.isPresent()) {
                                PurchaseOrder purchaseorder = optPurchaseOrder.get();
                                document.add(new Paragraph("Purchase Order\n# " + poid).setFont(font).setFontSize(18)
                                                .setBold()
                                                .setMarginRight(pg.getWidth() / 2 - 650)
                                                .setMarginTop(pg.getWidth() / 2 - 365)
                                                .setTextAlignment(TextAlignment.CENTER));
                                document.add(new Paragraph("\n\n\n"));
                                // then a smaller heading
                                Table tableEmp = new Table(2);
                                Cell cellEmp = new Cell().add(new Paragraph("Vendor: ")
                                                .setFont(font)
                                                .setFontSize(12)
                                                .setBold()
                                                .setMarginRight(15)
                                                .setTextAlignment(TextAlignment.LEFT))
                                                .setBorder(Border.NO_BORDER);
                                tableEmp.addCell(cellEmp);

                                Optional<Vendor> opt = vendorRepository.findById(purchaseorder.getVendorid());
                                if (opt.isPresent()) {
                                        Vendor vendor = opt.get();
                                        cellEmp = new Cell().add(new Paragraph(vendor.getName() + "\n"
                                                        + vendor.getAddress1() + "\n" + vendor.getCity() + "\n"
                                                        + vendor.getProvince() + "\n"
                                                        + vendor.getEmail())
                                                        .setFont(font)
                                                        .setFontSize(12)
                                                        .setMarginRight(15)
                                                        .setTextAlignment(TextAlignment.LEFT))
                                                        .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                                                        .setBorder(Border.NO_BORDER);
                                        tableEmp.addCell(cellEmp);
                                }
                                document.add(tableEmp);
                                document.add(new Paragraph("\n\n\n"));
                                // now a 3 column table
                                Table table = new Table(5);
                                // table.setWidth(new UnitValue(UnitValue.PERCENT, 100));
                                // Unfortunately we must format each cell individually :(
                                // table headings
                                Cell cell = new Cell().add(new Paragraph("Product Code")
                                                .setFont(font)
                                                .setFontSize(12)
                                                .setBold())
                                                .setTextAlignment(TextAlignment.CENTER)
                                                .setMaxWidth(100);
                                table.addCell(cell);
                                cell = new Cell().add(new Paragraph("Description")
                                                .setFont(font)
                                                .setFontSize(12)
                                                .setBold())
                                                .setTextAlignment(TextAlignment.CENTER)
                                                .setWidth(100);
                                table.addCell(cell);
                                cell = new Cell().add(new Paragraph("Qty Sold")
                                                .setFont(font)
                                                .setFontSize(12)
                                                .setBold())
                                                .setTextAlignment(TextAlignment.CENTER)
                                                .setWidth(100);
                                table.addCell(cell);
                                cell = new Cell().add(new Paragraph("Price")
                                                .setFont(font)
                                                .setFontSize(12)
                                                .setBold())
                                                .setTextAlignment(TextAlignment.CENTER)
                                                .setWidth(100);
                                table.addCell(cell);
                                cell = new Cell().add(new Paragraph("Ext. Price")
                                                .setFont(font)
                                                .setFontSize(12)
                                                .setBold())
                                                .setTextAlignment(TextAlignment.CENTER)
                                                .setWidth(100);
                                table.addCell(cell);
                                // table details
                                BigDecimal tot = new BigDecimal(0.0);// for total
                                BigDecimal tax = new BigDecimal(0.0);// for tax
                                BigDecimal poTotal = new BigDecimal(0.0);// for Purchase total
                                for (PurchaseOrderLineitem line : purchaseorder.getItems()) {
                                        Optional<Product> optx = productRepository.findById(line.getProductid());
                                        if (optx.isPresent()) {
                                                Product product = optx.get();

                                                cell = new Cell().add(new Paragraph(product.getId())
                                                                .setFont(font)
                                                                .setFontSize(12)
                                                                .setTextAlignment(TextAlignment.CENTER));
                                                table.addCell(cell);

                                                cell = new Cell().add(new Paragraph(product.getName())
                                                                .setFont(font)
                                                                .setFontSize(12)
                                                                .setTextAlignment(TextAlignment.CENTER));
                                                table.addCell(cell);

                                                cell = new Cell().add(new Paragraph(
                                                                String.valueOf(line.getQty()))
                                                                .setFont(font)
                                                                .setFontSize(12)
                                                                .setTextAlignment(TextAlignment.CENTER));
                                                table.addCell(cell);

                                                cell = new Cell().add(new Paragraph(String
                                                                .valueOf((formatter.format(product.getCostprice()))))
                                                                .setFont(font)
                                                                .setFontSize(12)
                                                                .setTextAlignment(TextAlignment.RIGHT));
                                                table.addCell(cell);

                                                cell = new Cell().add(new Paragraph(
                                                                String.valueOf(
                                                                                formatter.format(line.getPrice()
                                                                                                .multiply(BigDecimal
                                                                                                                .valueOf(line.getQty())))))
                                                                .setFont(font)
                                                                .setFontSize(12)
                                                                .setTextAlignment(TextAlignment.RIGHT));
                                                table.addCell(cell);

                                                // compute total
                                                BigDecimal temp = new BigDecimal(0);// for temp
                                                temp = temp.add(line.getPrice());
                                                temp = temp.multiply(BigDecimal.valueOf(line.getQty()));
                                                tot = tot.add(temp);

                                        }
                                }

                                tax = tot.multiply(new BigDecimal(0.13), new MathContext(8, RoundingMode.UP));
                                poTotal = tot.add(tax);
                                // table total
                                cell = new Cell(1, 4).add(new Paragraph("Sub Total:"))
                                                .setBorder(Border.NO_BORDER)
                                                .setTextAlignment(TextAlignment.RIGHT);
                                table.addCell(cell);
                                cell = new Cell().add(new Paragraph(formatter.format(tot)))
                                                .setTextAlignment(TextAlignment.RIGHT);
                                table.addCell(cell);

                                cell = new Cell(1, 4).add(new Paragraph("Tax:"))
                                                .setBorder(Border.NO_BORDER)
                                                .setTextAlignment(TextAlignment.RIGHT);
                                table.addCell(cell);
                                cell = new Cell().add(new Paragraph(formatter.format(tax)))
                                                .setTextAlignment(TextAlignment.RIGHT);
                                table.addCell(cell);

                                cell = new Cell(1, 4).add(new Paragraph("PurchaseOrder Total:"))
                                                .setBorder(Border.NO_BORDER)
                                                .setTextAlignment(TextAlignment.RIGHT);
                                table.addCell(cell);
                                cell = new Cell().add(new Paragraph(formatter.format(poTotal)))
                                                .setTextAlignment(TextAlignment.RIGHT)
                                                .setBackgroundColor(ColorConstants.YELLOW);
                                table.addCell(cell);
                                document.add(table);
                                document.add(new Paragraph("\n\n"));
                                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd h:mm a");
                                document.add(new Paragraph(dateFormatter.format(purchaseorder.getPodate()))
                                                .setTextAlignment(TextAlignment.CENTER));

                                Vendor vendor = opt.get();
                                PurchaseOrder po = optPurchaseOrder.get();
                                Image qrcode = addSummaryQRCode(vendor, po, formatter);
                                document.add(qrcode);

                                document.close();
                        }
                } catch (Exception ex) {
                        Logger.getLogger(Generator.class.getName()).log(Level.SEVERE, null, ex);
                }
                // finally send stream back to the controller
                return new ByteArrayInputStream(baos.toByteArray());

        }// generatePurchaseOrder

        private static Image addSummaryQRCode(Vendor vendor, PurchaseOrder po, NumberFormat formatter) {
                QRCodeGenerator generator = new QRCodeGenerator();
                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd h:mm a");
                qrcodebin = generator.generateQRCode("Summary for Purchase Order:" + po.getId() + "\nDate:"
                                + dateFormatter.format(po.getPodate()) + "\nVendor:"
                                + vendor.getName()
                                + "\nTotal:" + formatter.format(po.getAmount()));
                return new Image(ImageDataFactory.create(qrcodebin)).scaleAbsolute(100, 100).setFixedPosition(460, 60);
        }

}// PurchaseOrderPDFGenerator
