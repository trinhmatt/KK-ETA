import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ spacing }) => ({
    content: {
        padding: 10,
    },
    title: {
        color: '#000',
        letterSpacing: '2px',
    },
    clist: {
        maxWidth: 340,
        margin: 'auto',
        borderRadius: spacing(2),
        position: 'relative',
    },
    bufferbox: {
        minWidth: 300,
        minHeight: 200,
        margin: 'auto',
        borderRadius: spacing(2),
        position: 'relative',
    },
    icon: {
        minWidth: 70,
        minHeight: 70,
        margin: 'auto',
        position: 'relative',
    },
    cta: {
        display: 'block',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '3px',
        fontWeight: 500,
        fontSize: 22,
    },
    errmsg: {
        display: 'block',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '3px',
        fontWeight: 300,
        fontSize: 18,
        backgroundColor: '#e0486b',
    },
    h3: {
        display: 'block',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '3px',
        fontWeight: 700,
        fontSize: 22,
    },
    h4plain: {
        display: 'inline-block',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '3px',
        fontWeight: 300,
        fontSize: 16,
        lineHeight: '1.5em',
    },
    h4bold: {
        display: 'inline-block',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '3px',
        fontWeight: 500,
        fontSize: 18,
        lineHeight: '1em',
    },
    h4space: {
        display: 'inline-block',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '3px',
        fontWeight: 300,
        fontSize: 18,
        lineHeight: '1.5em',
    },
    h4cool: {
        display: 'inline-block',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '3px',
       // fontWeight: 200,
        fontSize: 30,
        paddingLeft: '10%',
        paddingRight: '10%',
        borderRadius: 10,
        lineHeight: '1.5em',
        backgroundImage: 'linear-gradient( 68.3deg,  rgba(23,41,77,0.8) 6.3%, rgba(243,113,154,0.8) 90.9% )'
    },
    h4: {
        display: 'inline-block',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '3px',
        fontWeight: 300,
        fontSize: 16,
        backgroundColor: 'black',
        lineHeight: '1.5em',
        padding: '3%',
    },
    h4yellow: {
        display: 'inline-block',
        textAlign: 'center',
        color: '#000',
        letterSpacing: '3px',
        fontWeight: 300,
        fontSize: 16,
        backgroundColor: '#ffc31f',
        //Enables \n 
        whiteSpace: 'pre-line',
    },
    h4red: {
        display: 'inline-block',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '5px',
        fontWeight: 300,
        fontSize: 16,
        backgroundColor: '#db3d3d',
        paddingLeft: '4%',
        paddingRight: '4%',
        //Enables \n 
        whiteSpace: 'pre-line',
        borderRadius: 25,
    },
    h5red: {
        display: 'inline-block',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '3px',
        fontWeight: 400,
        fontSize: 18,
        backgroundColor: '#db3d3d',
        lineHeight: '1.5em',
        padding: '3%',
        borderRadius: 30,
    },
    h6red: {
        display: 'inline-block',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '2px',
        fontWeight: 300,
        fontSize: 12,
        backgroundColor: '#db3d3d',
        paddingLeft: '4%',
        paddingRight: '4%',
        //Enables \n 
        whiteSpace: 'pre-line',
        lineHeight: '1.5em',
    },
    h6plain: {
        display: 'inline-block',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '2px',
        fontWeight: 300,
        fontSize: 12,
        paddingLeft: '4%',
        paddingRight: '4%',
        //Enables \n 
        whiteSpace: 'pre-line',
        lineHeight: '1.5em',
    },
    h5: {
        display: 'block',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '3px',
        fontWeight: 300,
        fontSize: 12,
        backgroundColor: 'black',
    },
    h6yellow: {
        display: 'inline-block',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '2px',
        fontWeight: 400,
        fontSize: 16,
        paddingLeft: '4%',
        paddingRight: '4%',
        //Enables \n 
        whiteSpace: 'pre-line',
        lineHeight: '1.5em',
    },
    h7blue: {
        display: 'inline-block',
        textAlign: 'center',
        color: '#5c2aff',
        letterSpacing: '2px',
        fontSize: 14,
        paddingLeft: '4%',
        paddingRight: '4%',
        //Enables \n 
        whiteSpace: 'pre-line',
        lineHeight: '1.5em',
    },
    default: {
        display: 'block',
        color: '#000',
        letterSpacing: '1px',
        fontWeight: 500,
        fontSize: 16,
        whiteSpace: 'pre-line',
        lineHeight: '1.5em',
    },
    defaultBigger: {
        display: 'block',
        color: '#000',
        letterSpacing: '1px',
        fontWeight: 500,
        fontSize: 14,
        whiteSpace: 'pre-line',
        lineHeight: '1.5em',
        border: '1px dashed',
        padding: '2%',
        opacity: '80%',
        backgroundColor: '#fff',
    },
    yellowh5: {
        display: 'block',
        textAlign: 'center',
        color: '#ffc31f',
        letterSpacing: '3px',
        fontWeight: 300,
        fontSize: 14,
    },
    infobox: {
        minWidth: window.screen.width,
        minHeight: window.screen.height,
        position: 'relative',
        justifyContent:'center', 
        alignItems:'center', 
    },
    homebox: {
        minWidth: window.screen.width,
        minHeight: window.screen.height,
        position: 'relative',
        display: 'flex',  
        justifyContent:'center', 
        alignItems:'center', 
    },
    cbox: {
        maxWidth: 335,
       // margin: 'auto',
        borderRadius: spacing(2),
        position: 'relative',
    },
    popup: {
        minWidth: 200,
        minHeight: 50,
        margin: 'auto',
        borderRadius: spacing(2),
        position: 'relative',
    },
    infoerrmsg: {
        display: 'block',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '3px',
        fontWeight: 300,
        fontSize: 12,
        backgroundColor: '#e0486b',
    },
    column: {
        flexBasis: '33.33%',
    }
}));

export { useStyles };