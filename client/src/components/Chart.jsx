import React  from 'react'
import {
    Bar,
    BarChart,
    Legend,
    Rectangle,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
  } from "recharts";
  
const Chart = ({data}) => {
  
    return (
    <ResponsiveContainer  //ResponsiveContainer is a wrapper component for recharts
        width={"95%"} //width and height are set to 100% so that the chart can take the full width and height of its container
        height={400}
    >
        <BarChart //BarChart is a chart component for recharts
            width={100} 
            height={40}
            data={data} //data is passed as props
            margin={{
                top: 10,
                right: 40,
                left: 40,
                bottom: -10,
              }}
        >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey= "name"/> {/*axis-X*/}
            <YAxis /> {/*axis-Y*/}
            <Tooltip /> {/*for hovering chart*/}
            <Legend /> {/*chart legend(reference)*/}
             {/*grid of chart <CartesianGrid strokeDasharray="3 3" /> */} 
            <Bar dataKey="task" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />}/>  
            <Bar dataKey="bill" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />}/> 
        </BarChart>

    </ResponsiveContainer>
  )
}

export default Chart