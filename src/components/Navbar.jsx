import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <Navbar sticky="top" expand="md" className="p-3 flex justify-center">
      <Container>
        {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
        {/* <Navbar.Collapse id="responsive-navbar-nav"> */}
        <Nav className="space-x-4 ">
          <Link to="/">Test</Link>
          <Link to="/createandsend">Create and Send</Link>
          <Link to="/mintburnsell">Mint/Burn/Sell NFTs</Link>
        </Nav>
        {/* </Navbar.Collapse> */}
      </Container>
    </Navbar>
  );
}

export default NavBar;
