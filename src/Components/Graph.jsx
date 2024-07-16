import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { dataContext } from "../Context/DbContext";
import { Chart } from 'react-google-charts';
import { Box } from '@mui/material';

export default function Graph() {
    const { allData } = useContext(dataContext);
    const [selectedCustomer, setSelectedCustomer] = useState(allData.length > 0 ? allData[0].name : null);
    const customerNames = allData.map(customer => customer.name);

    const handleCustomerChange = (event, newValue) => {
        setSelectedCustomer(newValue);
    };

    const getChartDataByCustomer = () => {
        if (!selectedCustomer) return [['Day', 'Amount']];
        const customer = allData.find(customer => customer.name === selectedCustomer);
        if (!customer) return [['Day', 'Amount']]
        const chartData = [['Day', 'Amount']];
        customer.transactions.forEach((transaction, index) => {
            const day = `Day ${index + 1}`;
            chartData.push([day, transaction.amount]);
        });
        return chartData;
    };

    const chartOptionsByCustomer = {
        title: `Transactions Amount per Day for ${selectedCustomer}`,
        hAxis: {
            title: 'Day',
        },
        vAxis: {
            title: 'Amount',
            minValue: 0,
        },
        legend: 'none',
    };

    return (
        <>
            <Box className="container ">
                <Autocomplete
                    disablePortal
                    id="customer-names-autocomplete"
                    options={customerNames}
                    sx={{ width: '45%' ,justifyContent:'center' ,mx:'auto' ,alignItems:'center'}}
                    value={selectedCustomer}
                    onChange={handleCustomerChange}
                    renderInput={(params) => <TextField {...params} label="Customer Name" />}
                />
            </Box>
            <Box className='graph'>
                {selectedCustomer && (
                    <div className="customer-info">
                        <div className="graph">
                            <Chart
                                chartType="LineChart"
                                data={getChartDataByCustomer()}
                                options={chartOptionsByCustomer}
                                width="100%"
                                height="400px"
                                legendToggle
                            />
                        </div>
                    </div>
                )}
            </Box>
        </>
    );
};
