// components/PDFDocument.jsx

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#EDEBF2',
    padding: 10,
  },
  section: {
    margin: 1,
    padding: 1,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
});

const PDFDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
    <View style={styles.section}>
        <Text style={styles.title}>CollabFamily System Data Report</Text>
        <Text style={styles.text}>{`Total Users: ${data?.statistics?.usersCount || 'Loading...'}`}</Text>
        <Text style={styles.text}>{`Total Families: ${data?.statistics?.familiesCount || 'Loading...'}`}</Text>
        <Text style={styles.text}>{`Total Tasks: ${data?.statistics?.tasksCount || 'Loading...'}`}</Text>
        <Text style={styles.text}>{`Total Bills: ${data?.statistics?.billsCount || 'Loading...'}`}</Text>
        <Text style={styles.text}>{`Total Notifications: ${data?.statistics?.notificationsCount || 'Loading...'}`}</Text>

        {data?.notifications?.map((item, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.subtitle}>{`Notification ${index + 1}`}</Text>
            <Text style={styles.text}>{`Type: ${item.type}`}</Text>
            <Text style={styles.text}>{`Type Title: ${item.typeTitle}`}</Text>
            <Text style={styles.text}>{`Datelines: ${item.typeDatelines}`}</Text>
            <Text style={styles.text}>{`Family ID: ${item.FamilyId}`}</Text>
            <Text style={styles.text}>{`Status: ${item.status}`}</Text>
            <Text style={styles.text}>{`Sent: ${item.sentAt}`}</Text>
            <Text style={styles.text}>{`Successful: ${item.successfulAt}`}</Text>
            <Text style={styles.text}>{`Last Updated: ${item.updatedAt}`}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default PDFDocument;
