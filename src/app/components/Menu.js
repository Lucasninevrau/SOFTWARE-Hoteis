import { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { BsCart2, BsClipboard, BsHeart, BsPersonCircle, BsSearch } from "react-icons/bs";
import Select from 'react-select';
import { useRouter } from 'next/navigation'; // Importando o useRouter

export default function Menu() {
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [filteredProdutos, setFilteredProdutos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (usuario) {
            setUsuarioLogado(usuario.usuario);
        }

        const produtosCadastrados = JSON.parse(localStorage.getItem('produtos')) || [];
        const formattedProdutos = produtosCadastrados.map(produto => ({
            value: produto.nome,
            label: produto.nome,
            urlPrincipal: produto.urlPrincipal,
            id: produto.id,
            produtoCompleto: produto
        }));
        setProdutos(formattedProdutos);
        setFilteredProdutos(formattedProdutos);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('usuarioLogado');
        setUsuarioLogado(null);
    };

    const handleInputChange = (inputValue) => {
        setSearchTerm(inputValue);
        if (inputValue) {
            const filtered = produtos.filter(produto =>
                produto.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredProdutos(filtered);
        } else {
            setFilteredProdutos(produtos);
        }
    };

    const handleSearchChange = (selectedOption) => {
        if (selectedOption) {
            router.push(`/produto/${selectedOption.id}`);
        }
    };

    const handleSearchClick = () => {
        // Redireciona para o primeiro produto filtrado se houver
        if (filteredProdutos.length > 0) {
            router.push(`/produto/${filteredProdutos[0].id}`);
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
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', width: '100%', position: 'relative' }}>
                            <div style={{ maxWidth: '400px', width: '100%' }}>
                                <Select
                                    options={filteredProdutos}
                                    onChange={handleSearchChange}
                                    onInputChange={handleInputChange}
                                    placeholder="Pesquisar produtos"
                                    isClearable
                                    isSearchable
                                    noOptionsMessage={() => "Nenhum produto encontrado"}
                                    formatOptionLabel={formatOptionLabel}
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            paddingLeft: '40px', // espaço para a lupa
                                            borderColor: 'white',
                                            backgroundColor: 'white',
                                            position: 'relative' // permite posicionar a lupa
                                        }),
                                        dropdownIndicator: (provided) => ({
                                            ...provided,
                                            display: 'none' // esconder o indicador padrão
                                        }),
                                        indicatorsContainer: (provided) => ({
                                            ...provided,
                                            cursor: 'pointer' // faz o cursor mudar para pointer
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

                            {usuarioLogado === 'master' && (
                                <NavDropdown title={<><BsClipboard className="me-2" size={25} /> Cadastros</>} id="nav-dropdown">
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
