import React from 'react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';
import ModalWrapper from './ModalWrapper';
import { Dialog } from '@headlessui/react';
import { IoMdClose } from "react-icons/io";

const ChartBill = ({ data, open, setOpen }) => {
    const currentYear = new Date().getFullYear();

    return (
        <ModalWrapper open={open} setOpen={setOpen}>

            <Dialog.Title
                as='h2'
                className='text-base font-bold leading-6 text-gray-900 mb-4 items-center justify-center flex flex-row'
            >
                {currentYear} Bill Per Month
            </Dialog.Title>
            <ResponsiveContainer
                width="100%"
                height={400}
            >
                <LineChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    className="rounded-md px-2 py-2 bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                >
                    <IoMdClose />
                </button>
            </div>
        </ModalWrapper>
    );
};


export default ChartBill;
