import React, { useState, useContext, useEffect } from 'react';
import { TextField, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ExpenseTrackerContext } from '../../../context/context';
import { v4 as uuidv4 } from 'uuid';
import { useSpeechContext } from '@speechly/react-client';

//import formatDate from '../../../utils/formatDate';
import useStyles from './styles';
import { incomeCategories, expenseCategories } from '../../../constants/categories';
import CustomizedSnackbar from '../../Snackbar/Snackbar';

const initialState = {
    type: 'Income',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
}

const Form = () => {
    const classes = useStyles();
    const [formData, setformData] = useState(initialState);
    const { addTransaction } = useContext(ExpenseTrackerContext);
    const { segment } = useSpeechContext();
    const [open, setOpen] = useState(false);

    const createTransaction = () => {
        if(Number.isNaN(Number(formData.amount)) || 
           Number(formData.amount) === 0 || 
           formData.category.length === 0 ||
           !formData.date.includes('-')) {
            return;
        }
        const transaction = { ...formData, amount: Number(formData.amount), id: uuidv4() };
        setOpen(true);
        addTransaction(transaction);
        setformData(initialState);
    }

    useEffect(() => {
        if (segment) {
            if(segment.intent.intent === 'add_expense') {
                setformData({...formData, type: 'Expense'});
            }
            else if(segment.intent.intent === 'add_income') {
                setformData({...formData, type: 'Income'});
            }
            else if(segment.isFinal && segment.intent.intent === "create_transaction") {
                return createTransaction();
            }
            else if(segment.isFinal && segment.intent.intent === "cancel_transaction") {
                setformData(initialState);
            }

            segment.entities.forEach(entity => {
                const category = entity.value.charAt(0).toUpperCase() + entity.value.slice(1).toLowerCase();
                switch (entity.type) {
                    case 'amount':
                        setformData({ ...formData, amount: entity.value });
                        break;
                    case 'category':
                        if(incomeCategories.map(cat => cat.type).includes(category)) {
                            setformData({ ...formData, type: "Income", category: category });
                        }
                        else if(expenseCategories.map(cat => cat.type).includes(category)) {
                            setformData({ ...formData, type: "Expense", category: category });
                        }
                        break;
                    case 'date':
                        setformData({ ...formData, date: entity.value });
                        break;
                    default:
                        break;
                }
            });

            if(segment.isFinal && formData.type && formData.category && formData.amount && formData.date) {
                createTransaction();
            }
        }
    }, [segment]);

    const selectedCategories = formData.type === 'Income' ? incomeCategories : expenseCategories;

  return (
    <Grid container spacing={2}>
        <CustomizedSnackbar open={open} setOpen={setOpen} />
        <Grid item xs={12}>
            <Typography align='center' variant='subtitle2' gutterBottom>
                {segment && segment.words.map((w) => w.value).join(' ')}
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select value={formData.type} onChange={(e) => setformData({ ...formData, type: e.target.value })}>
                    <MenuItem value="Income">Income</MenuItem>
                    <MenuItem value="Expense">Expense</MenuItem>
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={6}>
            <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={formData.category} onChange={(e) => setformData({ ...formData, category: e.target.value }) } >
                    {selectedCategories.map(category => (
                        <MenuItem value={category.type} key={category.type}>{category.type}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={6}>
            <TextField type="number" label="Amount" fullWidth value={formData.amount} onChange={(e) => setformData({ ...formData, amount: e.target.value })} />
        </Grid>
        <Grid item xs={6}>
            <TextField type="date" label="Date" fullWidth value={formData.date} onChange={(e) => setformData({ ...formData, date: e.target.value })} />
        </Grid>
        <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={createTransaction}>Create</Button>
    </Grid>
  )
}

export default Form