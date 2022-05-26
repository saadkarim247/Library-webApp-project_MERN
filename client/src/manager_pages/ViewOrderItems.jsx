import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { getToken } from "../Utils/Common";
import useTable from '../Admin_Components/useTable';
import { makeStyles,TableBody, TableRow, TableCell,Toolbar,InputAdornment } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Input from '../Admin_Components/Input';
import ResponsiveDialog from '../Admin_Components/Popup_m_i_b';


const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(0),
        padding: theme.spacing(2)
    },
    searchInput: {
        width: '50%',
        marginLeft: '10px',
        marginBottom: "20px"
    }
}))

const headCells = [
    {id:'Book_ID', label: 'Book ID'},
    {id:'Title', label: 'Title'},
    {id:'Author', label: 'Author'},
    {id:'Price', label: 'Price'},
    {id:'Quantity', label: 'Quantity'},
    {id:'Period', label: 'Period'},
    {id:'Line_Total', label: 'Line Total'}
   
]
const ViewOrderItems = (props) => {
    const [CurrentOrder, setCurrentOrder] = useState(JSON.parse(sessionStorage.getItem('CurrentOrder')));
    const [loading, setLoading] = useState(false);
    const token = getToken();
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const classes = useStyles();

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            let config = {
                headers: {
                    Authorization: "basic " + token
                }
            }
            await axios.get('http://localhost:4000/users/getOrder_ItemsManager', config, {
            }).then(async response => {
                setCurrentOrder(response.data.data.message.order_items);
                sessionStorage.setItem('CurrentOrder', JSON.stringify(response.data.data.message.order_items));
                setLoading(false);
                //window.location.assign('/manager/Books');
                
            }).catch(error => {
          
            });
          
          };
     
        fetchOrder();
    }, []);

    
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
    } = useTable(CurrentOrder, headCells, filterFn);
    
    const handleSearch = e => {
        let target = e.target;
        
        setFilterFn({
            fn: items => {
                if (target.value == "")
                    return items;
                else
                    return items.filter(x => x.Title.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }
    return (
        <div>
            <div className='container mt-5'>

            <h1 className='text-primary mb-3'>Order Items</h1>
            <div className='bp'><ResponsiveDialog fullWidth='true'></ResponsiveDialog></div>
            <Toolbar>
                    <div className='inp'><Input
                    className={classes.searchInput} 
                    placeholder = "Search Title"
                    InputProps={{
                        startAdornment: (<InputAdornment position='start'>
                            <Search />
                            </InputAdornment>)
                    }}
                    onChange={handleSearch}
                    /></div>
                </Toolbar>
                
                
            <nbsp></nbsp>
            <TblContainer>
                <TblHead />
                <TableBody>
                    {recordsAfterPagingAndSorting().map(item => (
                        <TableRow key={item.Book_ID}>
                            <TableCell> {item.Book_ID} </TableCell>
                            <TableCell> {item.Title} </TableCell>
                            <TableCell> {item.Author} </TableCell>
                            <TableCell> {item.Price} </TableCell>
                            <TableCell> {item.Quantity} </TableCell>
                            <TableCell> {item.Period} </TableCell>
                            <TableCell> {item.Line_Total} </TableCell>

                            
                        </TableRow>
                    ))}
                </TableBody>
            </TblContainer>
            <br />
            <TblPagination />            
            </div>
        </div>
    )
}

export default ViewOrderItems;
