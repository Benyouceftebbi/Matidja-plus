

import { AreaChart, Area, XAxis,  Tooltip, ResponsiveContainer, } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
const GradientColors = () => {
    return (
<linearGradient id="colorView" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stopColor="#1C64F2" stopOpacity={0.55} />
  <stop offset="100%" stopColor="#1C64F2" stopOpacity={0} />
</linearGradient>
    );
  };
export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={100} >
      <AreaChart data={data}   
  
   margin={{
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  }}
          >
            <defs>
            <GradientColors />
          </defs>
          <Tooltip />
   
          <XAxis
      dataKey="name"
      stroke="#888888"
      fontSize={12}
      tickLine={false}
      axisLine={false}
      interval={0} // Display all labels
      angle={-45} // Rotate labels if needed
    />
     <Area type="monotone"
      dataKey="uv"   
          strokeWidth={3}
      stroke="#1A56DB"  
             fill="url(#colorView)"   />

      </AreaChart>
    </ResponsiveContainer>
  )
}