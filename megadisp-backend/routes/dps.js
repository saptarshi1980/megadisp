const express = require('express');
const router = express.Router();

// DPS Calculation endpoint
router.post('/calculate', (req, res) => {
  try {
    const { amount, dueDate, calcDate } = req.body;

    // Validate required fields
    if (!amount || !dueDate || !calcDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all fields: amount, dueDate, calcDate'
      });
    }

    // Parse values
    const parsedAmount = parseFloat(amount);
    const due = new Date(dueDate);
    const calc = new Date(calcDate);

    // Validate dates
    if (isNaN(due.getTime()) || isNaN(calc.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Please use YYYY-MM-DD format'
      });
    }

    // Calculate days difference
    const diffTime = calc - due;
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Validate that calculation date is after due date
    if (days <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Calculation date must be after due date'
      });
    }

    // Calculate days for each slab
    const s1days = Math.min(days, 90);
    const s2days = Math.max(Math.min(days - 90, 150), 0);
    const s3days = Math.max(days - 240, 0);

    // Calculate amounts for each slab
    const s1amt = parsedAmount * (s1days / 30) * 0.01;
    const s2amt = parsedAmount * (s2days / 30) * 0.015;
    const s3amt = parsedAmount * (s3days / 30) * 0.02;

    // Calculate total surcharge
    const surcharge = s1amt + s2amt + s3amt;

    // Prepare response
    const response = {
      success: true,
      data: {
        days: days,
        slabs: {
          slab1: {
            days: s1days,
            rate: '1% per month',
            amount: s1amt
          },
          slab2: {
            days: s2days,
            rate: '1.5% per month',
            amount: s2amt
          },
          slab3: {
            days: s3days,
            rate: '2% per month',
            amount: s3amt
          }
        },
        totalSurcharge: surcharge,
        originalAmount: parsedAmount,
        dueDate: due.toISOString().split('T')[0],
        calculationDate: calc.toISOString().split('T')[0]
      },
      formatted: {
        days: days.toString(),
        s1days: s1days.toString(),
        s2days: s2days.toString(),
        s3days: s3days.toString(),
        s1amt: s1amt.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
        s2amt: s2amt.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
        s3amt: s3amt.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
        surcharge: surcharge.toLocaleString('en-IN', { maximumFractionDigits: 2 })
      }
    };

    res.json(response);

  } catch (error) {
    console.error('DPS Calculation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Optional: GET endpoint for testing
router.get('/test', (req, res) => {
  res.json({
    message: 'DPS API is working',
    usage: 'Send POST request to /dps/calculate with JSON body containing amount, dueDate, calcDate',
    example: {
      amount: 10000,
      dueDate: "2026-01-01",
      calcDate: "2026-04-01"
    }
  });
});

module.exports = router;