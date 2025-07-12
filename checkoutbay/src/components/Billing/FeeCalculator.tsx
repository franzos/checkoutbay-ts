import { Box, Button, Text, NumberInput } from '@mantine/core';
import { Currency, formatCurrency } from '@gofranz/common';
import { useEffect, useState } from 'react';

const feePerSalePercent = 0.01; // 1% expressed as decimal

export function FeeCalculator() {
  const [totalFee, setTotalFee] = useState(0);
  const [totalSales, setTotalSales] = useState(10000);

  const calculate = () => {
    if (totalSales < 0) {
      setTotalSales(0);
    }
    const totalFee = (totalSales * feePerSalePercent).toFixed(2);
    setTotalFee(Number(totalFee));
  };

  useEffect(() => {
    calculate();
  }, []);

  useEffect(() => {
    calculate();
  }, [totalSales]);

  return (
    <Box>
      <NumberInput
        label="Total sales"
        prefix="€"
        thousandSeparator={true}
        value={totalSales}
        onChange={(e) => {
          if (typeof e === 'number') {
            setTotalSales(e);
          } else {
            setTotalSales(parseInt(e));
          }
        }}
        mb="xs"
      />
      <Text size="sm" mb="xs" c="gray">
        We charge by usage, not month; Make 10 sales per year? No problem.
      </Text>
      <Button onClick={calculate} mb="xs">
        Calculate
      </Button>
      <Text>Cost: {formatCurrency([Currency.EUR, totalFee * 100000])}</Text>
    </Box>
  );
}
