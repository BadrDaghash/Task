// DbContext.jsx
import axios from "axios";
import React, { createContext, useState, useEffect } from "react";

export const dataContext = createContext();

export default function DataContextProvider(props) {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [allData, setAllData] = useState([])


  async function fetchCustomers() {
    try {
      const response = await axios.get(`https://summit-api-kappa.vercel.app/customers`);
      setCustomers(response.data);
      console.log("Fetched customers:", response.data);
    } catch (error) {
      console.error("Error  customers:", error.message);
    }
  }

  async function fetchTransactions() {
    try {
      const response = await axios.get(`https://summit-api-kappa.vercel.app/transactions`);
      setTransactions(response.data);
      console.log("Fetched transactions:", response.data);
    } catch (error) {
      console.error("Error  transactions:", error.message);
    }
  }

  useEffect(() => {
    fetchCustomers();
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (customers.length > 0 && transactions.length > 0) {
      console.log("Combining data...");
      const combinedData = [];
      customers.forEach((customer) => {
        const customerTransactions = transactions.filter((transaction) => {
          console.log(`Checking transaction ${transaction.id} for customer ${customer.id}`);
          return String(transaction.customer_id) === String(customer.id);
        });
        console.log(`Customer ${customer.id} transactions:`, customerTransactions);
        if (customerTransactions.length > 0) {
          const existingCustomer = combinedData.find((data) => data.id === customer.id);
          if (existingCustomer) {
            existingCustomer.transactions.push(...customerTransactions);
          } else {
            combinedData.push({
              ...customer,
              transactions: customerTransactions,
            });
          }
        }
      });
      setAllData(combinedData);
      console.log("Combined data:", combinedData);
    } else {
      console.log("Customers or transactions are empty");
    }
  }, [customers, transactions]);
  
  return (
    <dataContext.Provider value={{ customers, fetchCustomers, transactions, fetchTransactions ,allData }} >
      {props.children}
    </dataContext.Provider>
  );
}
