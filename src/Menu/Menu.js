import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { data } from "./Menu_data.js";
import { allergies } from "./allergies.js";
import menu_data from './Menu_data.json';
import CardGroup from 'react-bootstrap/CardGroup';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import {Button} from 'react-bootstrap'; 
import Facets_container from './Facets_container';
import MenuItem from './MenuItem';
import ShowedMenuItem from './ShowedMenuItem';
import { Parallax } from 'react-parallax';
import backgroundimg from '../images/break3.jpg';
import { RiInbox2Fill } from 'react-icons/ri';
import './Menu.css';


function Menu() {

  const [item, setItem] = useState('');
 

  const build_categorical_facet_values = (name) => {
    const values = [...new Set(data.map(item => item[name]))]
    return values.map(value => ({ 'name': value, 'checked': false }))
  }


  // Initial state
  const [state, setState] = useState({
    all_menu: data,
    shown_menu: data,
    allergy_items: [],
    shown_table_menu: [],
    facets: {
      category: build_categorical_facet_values('category'),
      allergy: build_categorical_facet_values('allergy')
    }
  })

  //Updates state.shown_menu whenever state.facets changes
  useEffect(() => {
    const facets = {}
    // Get all the facet values that are true/active/selected.
    Object.entries(state.facets).forEach(([name, values]) => {
      facets[name] = []
      values.forEach(value => {
        if (value.checked) {
          facets[name].push(value.name)
        }
      })
    })

    // If there are no facets selected, show all menu
    if (Object.values(facets).every(arr => arr.length === 0)) {
      setState({ ...state, shown_menu: state.all_menu })
      return
    }

    // Getting the number of active facet (Not facet_values)
    const number_of_active_facets = Object.values(facets).filter(x => x.length).length

    // Double loop through all menu and all active facets
    // Keep only the items that match the active facets
     const to_show = state.all_menu.map(menuItem =>
      Object.entries(facets).map(([name, values]) =>
        values.includes(menuItem[name])).filter(Boolean).length === number_of_active_facets ? menuItem : undefined
    ).filter(Boolean); 
    
    
     //saving the to_show in shown_menu
     setState({ ...state, shown_menu: to_show })
     console.log("everything:"+state.shown_menu);
      
     if(state.shown_menu.length === 0){
      
      <p>{RiInbox2Fill}gfvvvvvvvvvvvvvvvvvvvv</p>
      
     }

    }, [state.facets])//end of use effect

  function clearAllFacetValues(facet) {
    const new_facet = state.facets[facet].map(facet_value => ({
      ...facet_value, checked: false
    }))
    setState({ ...state, facets: { ...state.facets, [facet]: new_facet } })
  }

  // Function to pass down to the Facet_value component to modify the state in this component.
  function updateCategory(facet, value, newChecked) {
    
    const new_facet = state.facets[facet].map(({ name, checked }) => ({ name: name, checked: name === value ? newChecked : checked }))
    setState({ ...state, facets: { ...state.facets, [facet]: new_facet } })

  }


  // table component
  const [isTableEmpty, setIsTableEmpty] = useState(true);

  // function to pass down to the MenuItem component and add the items to the table
  function updateTable(itemId){
    console.log(itemId);
    setItem(itemId); // Update the item state with the clicked item ID
    setState()
    const specificMenuItem = state.shown_menu.find(menuItem => menuItem.id === item);
  
    setState([ ...state.shown_table_menu, specificMenuItem]);
    setIsTableEmpty(false);
    //setState({ ...state, shown_table_menu: specificMenuItem ? [...state.shown_table_menu, specificMenuItem] : [] });
    
  }


  return (
    <div id="menu" className='menu'>
      <div className='menu_header'>
      <h1> Menu </h1>
        <hr></hr>
      </div>
      <Row>
        <Col className='border-end' md={3}>
          <Facets_container facets={state.facets} updateCategory={updateCategory} clearAllFacetValues={clearAllFacetValues} />
        </Col>
        <Col>
        <Container className='d-flex flex-wrap'>

            {state.shown_menu.map((item) => (
              <MenuItem
                key={item.id} 
                name={item.name}
                image={item.image}
                price={item.price}
                description={item.description}
                ingredients={item.ingredients}
                category={item.category}
                updateTable={updateTable} // Pass the function
                itemId={item.id} // Pass the item ID
              />
            ))}
          </Container>
        </Col>
      </Row>

      <div id='virtualtable' className='virtualtable'>
          <div className='table_header'>
            <h1>Your virtual table</h1>
            <hr></hr>
          </div>
          <div className='table'>
              <p>Selected Item ID: {item}</p>
              <Col>
                  {isTableEmpty ? (
                    <p>Your cart is empty. Start adding items!</p>
                  ) : (
                    /* Render the table items */
                    <Container className='d-flex flex-wrap'>
                      {state.shown_table_menu.map((item) => (
                        <ShowedMenuItem
                          key={item.id} 
                          name={item.name}
                          image={item.image}
                          price={item.price}
                          description={item.description}
                          ingredients={item.ingredients}
                          category={item.category}
                        />
                      ))}
                    </Container>
                  )}
                  
            </Col>
          </div>
      </div>

      <Parallax className="Menu-parallax" bgImage={backgroundimg} bgImageAlt="oops! I guess we missed an image here..." strength={100} height='10rem'>
              <div className='Menu-break-content'>
                <p>We are waiting for you!</p>
              </div>
      </Parallax>
     
      
    </div>
    
  );
}

export default Menu;