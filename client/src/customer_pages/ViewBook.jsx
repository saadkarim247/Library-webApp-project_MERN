import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import EditOutlined from '@material-ui/icons/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import Notification from '../Admin_Components/Notifications.js';
import axios from 'axios';
import { checkManager, getToken,setUserIDSession,setUserSession } from '../Utils/Common';
import Input from '../Admin_Components/Input.js';
import { InputAdornment } from '@mui/material';
import { Toolbar } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ResponsiveDialog from '../Admin_Components/Popup_password.js';



const ViewBook= (props) => {

    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [Name, setName] = React.useState(JSON.parse(sessionStorage.getItem('user')).Name);
    const [Email, setEmail] = React.useState(JSON.parse(sessionStorage.getItem('user')).Email);
    const [lname, setlname] = React.useState(JSON.parse(sessionStorage.getItem('Library')))
    const [Address, setAddress] = React.useState(JSON.parse(sessionStorage.getItem('user')).Address);
    const [Phone, setPhone] = React.useState(JSON.parse(sessionStorage.getItem('user')).Contact);
    const [Type, setType] = React.useState(JSON.parse(sessionStorage.getItem('user')).Type);
    const token = getToken();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const cm = checkManager();
    const [currentBook, setCurrentBook] = React.useState(JSON.parse(sessionStorage.getItem('CurrentBook')))
    const [currentBookReviews, setCurrentBookReviews] = React.useState(sessionStorage.getItem('CurrentBookReviews'));

    //console.log(Phone);

    React.useEffect(() => {
        
        let config = {
            headers: {
                Authorization: "basic " + token
            },
            book : currentBook[0].Book_ID
        }
        const fetchstuff = async () => {
        await axios.patch('http://localhost:4000/users/getOneBook', config, {
            headers: {
                Authorization: "basic " + token
            },
            book : currentBook[0].Book_ID
                
            }).then(async response => {
             //   console.table(response.data.data.result.book);
                setCurrentBook(response.data.data.result.book);
                sessionStorage.setItem('CurrentBook', JSON.stringify(response.data.data.result.book));
                // window.location.assign('/ViewBook');
    
            }).catch(error => {
    
            });
        // window.location.assign("/ViewBook")
       await  axios.patch('http://localhost:4000/users/getreviewsinglebook', config, {
            headers: {
                Authorization: "basic " + token
            },
            book : currentBook[0].Book_ID
                
            }).then(async response => {
               console.table(response.data.data.message.Reviews);
                setCurrentBookReviews(response.data.data.message.Reviews);
                sessionStorage.setItem('CurrentBookReviews', JSON.stringify(response.data.data.message.Reviews));
                // window.location.assign('/ViewBook');
    
            }).catch(error => {
                if (error.response.status === 500)
                sessionStorage.setItem('CurrentBookReviews', "No reviews");
            });
        }
        fetchstuff();
      }, []);
    
      
      


    const checkmngr = async () => {
        return (Type == 1 ? true : false)
    };

    const checkcustomer = async () => {
        return (Type == 2 ? true : false)
    }



    const handleChangeAddress = e => {
        setAddress(e.target.value);
    }

    const handleChangeName = e => {
        setName(e.target.value);
    }
    const handleChangePhone = e => {
        setPhone(e.target.value);
    }

    const handleUpdate = async () => {

        let config = {
            headers: {
                Authorization: "basic " + token
            },

            name: Name,
            address: Address,
            contact: Phone
        }
        await axios.patch('http://localhost:4000/users/updateProfile', config, {
            headers: {
                Authorization: "basic " + token
            },

            name: Name,
            address: Address,
            contact: Phone

        }).then(async response => {

            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Profile updated successfully",
                type: 'success'
            })
            
            setTimeout(function () {
                window.location.reload(false);
            }, 1000);
            //window.location.assign('/manager/Books');

        }).catch(error => {
            setLoading(false);
            if (error.response.status === 500) {
                //setError(error.response.data.data.message || "Enter a valid email");
                setNotify({
                    isOpen: true,
                    message: error.response.data.data.message,
                    type: 'error'
                })
                setError(error.response.data.data.message)
            }
        });

        
    };

    return (
        <div>
            <Toolbar></Toolbar>

            <div className='booktitle'> <h1 ><center>{currentBook[0].Title}</center></h1> </div>


            <Toolbar> <div className='bookimg'><img className='bookimg' src={currentBook[0].Book_Image} ></img></div></Toolbar>
           
            {/* <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginLeft: '39rem',
                    marginTop: '-26rem',
                    '& > :not(style)': {
                        m: 1,
                        width: 515,
                        height: 330,
                    },
                }}
            >
                 */}
              <Toolbar>  <div className='bookauth'> <h5 ><center> Book Author: {currentBook[0].Author}</center></h5> </div>
              </Toolbar>
                      

                    



                
            {/* </Box> */}



            <Notification
                notify={notify}
                setNotify={setNotify} />
        </div>
    )
}



export default ViewBook;