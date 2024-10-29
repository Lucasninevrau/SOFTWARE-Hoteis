import { useEffect, useState } from 'react'; 
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { BsClipboard, BsHeart, BsPersonCircle, BsCalendar } from "react-icons/bs"; 
import Select from 'react-select';
import { useRouter } from 'next/navigation';

export default function Menu() {
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [hoteis, setHoteis] = useState([]);
    const [filteredHoteis, setFilteredHoteis] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (usuario) {
            setUsuarioLogado(usuario.usuario);
        }

        const hoteisCadastrados = JSON.parse(localStorage.getItem('hoteis')) || [];
        const formattedHoteis = hoteisCadastrados.map(hotel => ({
            value: hotel.nome,
            label: hotel.nome,
            urlPrincipal: hotel.urlPrincipal,
            id: hotel.id,
            hotelCompleto: hotel
        }));
        setHoteis(formattedHoteis);
        setFilteredHoteis(formattedHoteis);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('usuarioLogado');
        setUsuarioLogado(null);
    };

    const handleInputChange = (inputValue) => {
        setSearchTerm(inputValue);
        if (inputValue) {
            const filtered = hoteis.filter(hotel =>
                hotel.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredHoteis(filtered);
        } else {
            setFilteredHoteis(hoteis);
        }
    };

    const handleSearchChange = (selectedOption) => {
        if (selectedOption) {
            router.push(`/hoteis/${selectedOption.id}`);
        }
    };

    const formatOptionLabel = ({ label, urlPrincipal }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
                src={urlPrincipal}
                alt={label}
                style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '4px' }}
            />
            <span>{label}</span>
        </div>
    );

    return (
        <div style={{ background: 'white' }}>
            <Container style={{ background: 'white' }}>
                <Navbar expand="lg" style={{ background: 'white', color: 'black' }} variant="light">
                    <Navbar.Brand href="/">
                        <img
                            src="/images/logo.png"
                            height="50"
                            className="d-inline-block align-top"
                            alt="Logo"
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-center">
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', width: '100%', position: 'relative' }}>
                            <div style={{ maxWidth: '400px', width: '100%' }}>
                                <Select
                                    options={filteredHoteis}
                                    onChange={handleSearchChange}
                                    onInputChange={handleInputChange}
                                    placeholder="Pesquisar hotéis"
                                    isClearable
                                    isSearchable
                                    noOptionsMessage={() => "Nenhum hotel encontrado"}
                                    formatOptionLabel={formatOptionLabel}
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            paddingLeft: '40px',
                                            borderColor: 'black',
                                            backgroundColor: 'white',
                                            position: 'relative'
                                        }),
                                        dropdownIndicator: (provided) => ({
                                            ...provided,
                                            display: 'none'
                                        }),
                                        indicatorsContainer: (provided) => ({
                                            ...provided,
                                            cursor: 'pointer'
                                        }),
                                    }}
                                />
                            </div>
                        </div>

                        <Nav className="ms-auto">
                            <Nav.Link href="/listadesejos" className="d-none d-lg-block" style={{ color: 'black' }}>
                                <BsHeart className="mx-2" size={25} /> Favoritos
                            </Nav.Link>

                            {/* NavDropdown para Agendamento */}
                            <NavDropdown title={<><BsCalendar className="mx-3" size={30} /> Agendamentos</>} id="nav-dropdown-agendamento">
                                <NavDropdown.Item href="/agendamento">Novo Agendamento</NavDropdown.Item>
                                <NavDropdown.Item href="/seusagendamentos">Seus Agendamentos</NavDropdown.Item>
                            </NavDropdown>

                            {usuarioLogado === 'master' && (
                                <NavDropdown title={<><BsClipboard className="me-2" size={25} /> Cadastros</>} id="nav-dropdown">
                                    <NavDropdown.Item href="/cadastro/hoteis">Cadastrar Hotel</NavDropdown.Item>
                                    <NavDropdown.Item href="/cadastro/quartos">Cadastrar Quartos</NavDropdown.Item>
                                </NavDropdown>
                            )}

                            <NavDropdown title={<><BsPersonCircle className="mx-2" size={20} />{usuarioLogado ? usuarioLogado : 'Entrar'}</>} id="nav-dropdown-user">
                                {usuarioLogado ? (
                                    <>
                                        <NavDropdown.Item href="/profile">Perfil</NavDropdown.Item>
                                        <NavDropdown.Item onClick={handleLogout}>Sair</NavDropdown.Item>
                                    </>
                                ) : (
                                    <>
                                        <NavDropdown.Item href="/login">Login</NavDropdown.Item>
                                        <NavDropdown.Item href="/register">Cadastro</NavDropdown.Item>
                                    </>
                                )}
                            </NavDropdown>

                            <Nav.Link href="/listadesejos" className="d-lg-none" style={{ color: 'black' }}>
                                <BsHeart className="mx-2" size={20} />
                            </Nav.Link>
                            <Nav.Link href="/agendamento" className="d-lg-none" style={{ color: 'black' }}>
                                <BsCalendar className="mx-3" size={20} />
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
        </div>
    );
}
