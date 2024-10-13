import { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { BsCart2, BsClipboard, BsHeart, BsPersonCircle } from "react-icons/bs";
import Select from 'react-select';

export default function Menu() {
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (usuario) {
            setUsuarioLogado(usuario.usuario);
        }

        const produtosCadastrados = JSON.parse(localStorage.getItem('produtos')) || [];
        setProdutos(produtosCadastrados.map(produto => ({ value: produto.nome, label: produto.nome, urlPrincipal: produto.urlPrincipal })));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('usuarioLogado');
        setUsuarioLogado(null);
    };

    const handleSearchChange = (selectedOption) => {
        if (selectedOption) {
            setSearchTerm(selectedOption.value);
        } else {
            setSearchTerm('');
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
        <div style={{ background: '#13293D' }}>
            <Container style={{ background: '#13293D' }}>
                <Navbar expand="lg" data-bs-theme="dark">
                    <Navbar.Brand href="/">
                        <img
                            src="/images/sportfy_logo.png"
                            height="50"
                            className="d-inline-block align-top"
                            alt="Logo"
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-center">
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <div style={{ maxWidth: '400px', width: '100%' }}>
                                <Select
                                    options={produtos}
                                    onChange={handleSearchChange}
                                    placeholder="Pesquisar produtos"
                                    isClearable
                                    isSearchable
                                    noOptionsMessage={() => "Nenhum produto encontrado"}
                                    formatOptionLabel={formatOptionLabel}
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            borderColor: 'white',
                                            backgroundColor: 'white',
                                        }),
                                    }}
                                />
                            </div>
                        </div>

                        <Nav className="ms-auto">
                            <Nav.Link href="/listadesejos" className="d-none d-lg-block">
                                <BsHeart className="mx-2" size={25} /> Lista de Desejo
                            </Nav.Link>


                            <Nav.Link href="/carrinho" className="d-none d-lg-block">
                                <BsCart2 className="mx-3" size={30} /> Carrinho
                            </Nav.Link>

                            {/* Menu Dropdown para Cadastros */}
                            {usuarioLogado === 'master' && (
                                <NavDropdown title={<><BsClipboard className="me-2" size={25} /> Cadastros</>} id="nav-dropdown" >
                                    <NavDropdown.Item href="/cadastro/produtos">Cadastrar Produto</NavDropdown.Item>
                                    <NavDropdown.Item href="/cadastro/categorias">Cadastrar Categoria</NavDropdown.Item>
                                    <NavDropdown.Item href="/cadastro/marcas">Cadastrar Marca</NavDropdown.Item>
                                    <NavDropdown.Item href="/cadastro/tamanhos">Cadastrar Tamanhos</NavDropdown.Item>
                                    <NavDropdown.Item href="/cadastro/cupons">Cadastrar Cupom</NavDropdown.Item>
                                </NavDropdown>
                            )}
                            
                            <NavDropdown title={<><BsPersonCircle className="mx-2" size={25} />{usuarioLogado ? usuarioLogado : 'Entrar'}</>} id="nav-dropdown">
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

                            {/* Ícones visíveis no mobile */}
                            <Nav.Link href="/listadesejos" className="d-lg-none">
                                <BsHeart className="mx-2" size={25} />
                            </Nav.Link>
                            <Nav.Link href="/carrinho" className="d-lg-none">
                                <BsCart2 className="mx-3" size={30} />
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
        </div>
    );
}
