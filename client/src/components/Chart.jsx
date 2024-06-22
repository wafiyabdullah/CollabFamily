import React from 'react'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
  
const Chart = ({data}) => {
  
    return (
    <ResponsiveContainer  //ResponsiveContainer is a wrapper component for recharts
        width={"95%"} //width and height are set to 100% so that the chart can take the full width and height of its container
        height={400}
    >
        <BarChart //BarChart is a chart component for recharts
            width={100} //width and height are set to 150 and 40 respectively so that the chart can take the full width and height of its container
            height={40}
            data={data} //data is passed as props
        >
            <XAxis dataKey={"name"}/> {/*axis-X*/}
            <YAxis dataKey={"total"}/> {/*axis-Y*/}
            <Tooltip /> {/*for hovering chart*/}
            <Legend /> {/*chart legend(reference)*/}
             {/*grid of chart <CartesianGrid strokeDasharray="3 3" /> */} 
            <Bar
                dataKey="total" 
                fill="#808080" //Bar is a chart component for recharts
            />  
        </BarChart>

    </ResponsiveContainer>
  )
}

export default Chart