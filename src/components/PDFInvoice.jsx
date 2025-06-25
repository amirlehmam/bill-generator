import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Link, Font } from '@react-pdf/renderer'

// Register fonts for better typography
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica/v1/regular.ttf' },
    { src: 'https://fonts.gstatic.com/s/helvetica/v1/bold.ttf', fontWeight: 'bold' },
  ]
})

// Professional PDF styles - Full A4 page coverage
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 40,
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25
  },
  logo: {
    width: 100,
    height: 100,
    objectFit: 'contain'
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'right'
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginTop: 6
  },
  section: {
    margin: 8,
    padding: 8
  },
  twoColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  column: {
    width: '45%'
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3
  },
  text: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
    marginBottom: 2
  },
  clientName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTop: '1 solid #e5e7eb',
    borderBottom: '1 solid #e5e7eb',
    marginBottom: 20
  },
  dateColumn: {
    width: '30%'
  },
  dateTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 3
  },
  dateValue: {
    fontSize: 9,
    color: '#6b7280'
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#e5e7eb',
    marginBottom: 15
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableColHeader: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 6
  },
  tableCol: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#e5e7eb',
    padding: 6
  },
  tableColDescription: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#e5e7eb',
    padding: 6
  },
  tableCellHeader: {
    margin: 'auto',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  tableCell: {
    margin: 'auto',
    fontSize: 9,
    color: '#374151',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  tableCellLeft: {
    fontSize: 9,
    color: '#374151',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  tableCellRight: {
    fontSize: 9,
    color: '#374151',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  tableCellCenter: {
    fontSize: 9,
    color: '#374151',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20
  },
  totalsBox: {
    width: '40%'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3
  },
  totalLabel: {
    fontSize: 9,
    color: '#6b7280'
  },
  totalValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151'
  },
  totalTTCRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTop: '2 solid #374151',
    marginTop: 6
  },
  totalTTCLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  totalTTCValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb'
  },
  paymentSection: {
    borderTop: '1 solid #e5e7eb',
    paddingTop: 15,
    marginBottom: 15
  },
  paymentTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8
  },
  paymentColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  paymentColumn: {
    width: '45%'
  },
  paymentSubtitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 5
  },
  paymentText: {
    fontSize: 8,
    color: '#4b5563',
    lineHeight: 1.3,
    marginBottom: 2
  },
  paymentButton: {
    backgroundColor: '#2563eb',
    borderRadius: 5,
    padding: 6,
    marginTop: 6,
    alignItems: 'center'
  },
  paymentButtonText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold'
  },
  legalSection: {
    borderTop: '1 solid #e5e7eb',
    paddingTop: 12
  },
  legalTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6
  },
  legalColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  legalColumn: {
    width: '45%'
  },
  legalText: {
    fontSize: 7,
    color: '#6b7280',
    lineHeight: 1.3,
    marginBottom: 1.5
  },
  notes: {
    borderTop: '1 solid #e5e7eb',
    paddingTop: 12,
    marginBottom: 12
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 5
  },
  notesText: {
    fontSize: 8,
    color: '#4b5563',
    lineHeight: 1.3
  }
})

const PDFInvoice = ({ invoice }) => {
  const formatCurrency = (amount) => {
    const formatted = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0)
    
    // Fix pour React-PDF : remplacer les caractères problématiques
    return formatted
      .replace(/\u00A0/g, ' ')  // Remplacer l'espace insécable par un espace normal
      .replace(/\//g, ' ')      // Remplacer les slashes par des espaces
      .replace(/\u202F/g, ' ')  // Remplacer l'espace fine par un espace normal
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with logo and invoice title */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            src="/logo_transparent.png"
          />
          <View>
            <Text style={styles.invoiceTitle}>FACTURE</Text>
            <Text style={styles.invoiceNumber}>N° {invoice.invoiceNumber}</Text>
          </View>
        </View>

        {/* Company and client information */}
        <View style={styles.twoColumns}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>De</Text>
            <Text style={styles.companyName}>{invoice.company.name}</Text>
            <Text style={styles.text}>{invoice.company.address}</Text>
            <Text style={styles.text}>{invoice.company.city}</Text>
            <Text style={styles.text}>{invoice.company.country}</Text>
            {invoice.company.phone && <Text style={styles.text}>{invoice.company.phone}</Text>}
            {invoice.company.email && <Text style={styles.text}>{invoice.company.email}</Text>}
            {invoice.company.website && <Text style={styles.text}>{invoice.company.website}</Text>}
          </View>
          
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Facturé à</Text>
            <Text style={styles.clientName}>{invoice.client.name?.toUpperCase()}</Text>
            {invoice.client.address && <Text style={styles.text}>{invoice.client.address?.toUpperCase()}</Text>}
            {(invoice.client.postalCode || invoice.client.city) && (
              <Text style={styles.text}>
                {invoice.client.postalCode?.toUpperCase()} {invoice.client.city?.toUpperCase()}
              </Text>
            )}
            {invoice.client.country && <Text style={styles.text}>{invoice.client.country?.toUpperCase()}</Text>}
          </View>
        </View>

        {/* Dates and payment terms */}
        <View style={styles.dateSection}>
          <View style={styles.dateColumn}>
            <Text style={styles.dateTitle}>Date de facture</Text>
            <Text style={styles.dateValue}>{formatDate(invoice.date)}</Text>
          </View>
          <View style={styles.dateColumn}>
            <Text style={styles.dateTitle}>Date d'échéance</Text>
            <Text style={styles.dateValue}>{formatDate(invoice.dueDate)}</Text>
          </View>
          <View style={styles.dateColumn}>
            <Text style={styles.dateTitle}>Conditions de paiement</Text>
            <Text style={styles.dateValue}>{invoice.paymentTerms}</Text>
          </View>
        </View>

        {/* Services table */}
        {invoice.detailed ? (
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.tableRow}>
              {invoice.detailedColumns.map(col => (
                <View key={col.key} style={{ ...styles.tableCol, width: `${100 / invoice.detailedColumns.length}%` }}>
                  <Text style={styles.tableCellHeader}>{col.label}</Text>
                </View>
              ))}
            </View>
            {/* Table rows */}
            {invoice.detailedRows.map((row, idx) => (
              <View key={idx} style={styles.tableRow}>
                {invoice.detailedColumns.map(col => (
                  <View key={col.key} style={{ ...styles.tableCol, width: `${100 / invoice.detailedColumns.length}%` }}>
                    <Text style={styles.tableCell}>{row[col.key] || ''}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.tableRow}>
              <View style={styles.tableColDescription}>
                <Text style={styles.tableCellHeader}>Description</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Qté</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Prix HT</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>TVA</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Total HT</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Total TTC</Text>
              </View>
            </View>
            {/* Table rows */}
            {invoice.items && invoice.items.map((item, index) => {
              const totalHT = (item.quantity || 0) * (item.unitPrice || 0)
              const vatAmount = totalHT * ((item.vatRate || 0) / 100)
              const totalTTC = totalHT + vatAmount

              return (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableColDescription}>
                    <Text style={styles.tableCellLeft}>{item.description}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellCenter}>{item.quantity}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellRight}>{formatCurrency(item.unitPrice)}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellCenter}>{item.vatRate}%</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellRight}>{formatCurrency(totalHT)}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellRight}>{formatCurrency(totalTTC)}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total HT :</Text>
              <Text style={styles.totalValue}>{formatCurrency(invoice.totalHT)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total TVA :</Text>
              <Text style={styles.totalValue}>{formatCurrency(invoice.totalVAT)}</Text>
            </View>
            <View style={styles.totalTTCRow}>
              <Text style={styles.totalTTCLabel}>Total TTC :</Text>
              <Text style={styles.totalTTCValue}>{formatCurrency(invoice.totalTTC)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes :</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Payment information */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Modalités de paiement</Text>
          
          <View style={styles.paymentColumns}>
            <View style={styles.paymentColumn}>
              <Text style={styles.paymentSubtitle}>Virement bancaire</Text>
              <Text style={styles.paymentText}>IBAN : {invoice.company.iban}</Text>
              <Text style={styles.paymentText}>BIC/SWIFT : {invoice.company.bic}</Text>
              <Text style={styles.paymentText}>Bénéficiaire : {invoice.company.name}</Text>
            </View>
            
            <View style={styles.paymentColumn}>
              <Text style={styles.paymentSubtitle}>Paiement en ligne</Text>
              <Text style={styles.paymentText}>
                Payez par carte bancaire via Stripe
              </Text>
              <Text style={styles.paymentText}>
                Paiement sécurisé - Montant exact : {formatCurrency(invoice.totalTTC)}
              </Text>
              
              {/* Clickable Stripe payment link */}
              {invoice.stripePaymentLink && (
                <Link 
                  src={invoice.stripePaymentLink}
                  style={styles.paymentButton}
                >
                  <Text style={styles.paymentButtonText}>
                    Payer {formatCurrency(invoice.totalTTC)} en ligne
                  </Text>
                </Link>
              )}
            </View>
          </View>
        </View>

        {/* Legal information */}
        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>Informations légales</Text>
          <View style={styles.legalColumns}>
            <View style={styles.legalColumn}>
              <Text style={styles.legalText}>SIREN : {invoice.company.siren}</Text>
              <Text style={styles.legalText}>Code APE : {invoice.company.ape}</Text>
              <Text style={styles.legalText}>TVA : Non applicable selon l'art. 293B du CGI</Text>
            </View>
            <View style={styles.legalColumn}>
              <Text style={styles.legalText}>
                Facture émise conformément aux dispositions légales en vigueur.
              </Text>
              <Text style={styles.legalText}>
                En cas de retard de paiement, des pénalités de retard au taux légal 
                s'appliqueront automatiquement (Art. L. 441-6 du Code de commerce).
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default PDFInvoice 