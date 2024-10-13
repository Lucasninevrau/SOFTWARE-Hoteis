'use client'; // Certifique-se de usar isso para que o hook do router funcione

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Hook correto no sistema app
import { Form, Button, Container, Row, Col, Card, Alert, Spinner, Modal } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa'; // Importa ícone de adição e lixeira

export default function CadastrarProduto() {
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    valorOriginal: '',
    urlPrincipal: '',
    urlAdicional1: '',
    urlAdicional2: '',
    urlAdicional3: '',
    marca: '',
    categoria: '',
    tamanho: '' // Adicione o campo de tamanho aqui
  });

  const [usuarioMaster, setUsuarioMaster] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tipoCadastro, setTipoCadastro] = useState('');
  const [novoItem, setNovoItem] = useState('');
  const [tamanhos, setTamanhos] = useState([]);
  const roteador = useRouter();

  // Estado para o modal de confirmação de exclusão
  const [modalConfirmacaoVisible, setModalConfirmacaoVisible] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);

  const router = useRouter(); // Use o hook correto para navegação

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    setUsuarioMaster(usuarioLogado?.usuario === 'master');
    setProdutos(JSON.parse(localStorage.getItem('produtos')) || []);
    setMarcas(JSON.parse(localStorage.getItem('marcas')) || []);
    setCategorias(JSON.parse(localStorage.getItem('categorias')) || []);
    setTamanhos(JSON.parse(localStorage.getItem('tamanhos')) || []);


  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const produtosCadastrados = JSON.parse(localStorage.getItem('produtos')) || [];
    const novoProduto = {
      id: produtoSelecionado ? produtoSelecionado.id : produtosCadastrados.length + 1,
      ...formData,
      imagensAdicionais: [formData.urlAdicional1, formData.urlAdicional2, formData.urlAdicional3],
    };


    produtoSelecionado
      ? Object.assign(produtosCadastrados.find(produto => produto.id === produtoSelecionado.id), novoProduto)
      : produtosCadastrados.push(novoProduto);

    localStorage.setItem('produtos', JSON.stringify(produtosCadastrados));
    setProdutos(produtosCadastrados);
    setFormData({ nome: '', valor: '', valorOriginal: '', urlPrincipal: '', urlAdicional1: '', urlAdicional2: '', urlAdicional3: '', marca: '', categoria: '' });
    alert('Produto salvo com sucesso!');
  };

  const selecionarProduto = (produto) => {
    setProdutoSelecionado(produto);
    setFormData({
      nome: produto.nome,
      valor: produto.valor,
      valorOriginal: produto.valorOriginal,
      urlPrincipal: produto.urlPrincipal,
      marca: produto.marca,
      categoria: produto.categoria,
      tamanho: produto.tamanho || '', // Garanta que o tamanho seja carregado
      urlAdicional1: produto.imagensAdicionais[0] || '',
      urlAdicional2: produto.imagensAdicionais[1] || '',
      urlAdicional3: produto.imagensAdicionais[2] || ''
    });
  };


  const handleShowModal = (tipo) => {
    setTipoCadastro(tipo);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setNovoItem('');
  };

  const handleCadastrarNovoItem = () => {
    let novoArray;

    // Verifica o tipo de cadastro e cria o novo array
    if (tipoCadastro === 'marca') {
      novoArray = [...marcas, { id: marcas.length + 1, nome: novoItem }];
      localStorage.setItem('marcas', JSON.stringify(novoArray));
      setMarcas(novoArray);
    } else if (tipoCadastro === 'categoria') {
      novoArray = [...categorias, { id: categorias.length + 1, nome: novoItem }];
      localStorage.setItem('categorias', JSON.stringify(novoArray));
      setCategorias(novoArray);
    } else if (tipoCadastro === 'tamanho') { // Adiciona a verificação para tamanhos
      novoArray = [...tamanhos, { id: tamanhos.length + 1, tamanho: novoItem }];
      localStorage.setItem('tamanhos', JSON.stringify(novoArray));
      setTamanhos(novoArray);
    }

    handleCloseModal();
  };


  const handleShowModalConfirmacao = (id) => {
    setProdutoParaExcluir(id);
    setModalConfirmacaoVisible(true);
  };

  const handleCloseModalConfirmacao = () => {
    setModalConfirmacaoVisible(false);
    setProdutoParaExcluir(null);
  };

  const handleDeleteProduto = () => {
    const produtosCadastrados = JSON.parse(localStorage.getItem('produtos')) || [];
    const produtosFiltrados = produtosCadastrados.filter(produto => produto.id !== produtoParaExcluir);
    localStorage.setItem('produtos', JSON.stringify(produtosFiltrados));
    setProdutos(produtosFiltrados);
    handleCloseModalConfirmacao();
    alert('Produto excluído com sucesso!');
  };

  if (usuarioMaster === null) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Verificando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-lg">
            <h2 className="text-center mb-4">Cadastrar Produto</h2>
            {usuarioMaster ? (
              <>
                <Form onSubmit={handleSubmit}>
                  {['nome', 'valor', 'valorOriginal', 'urlPrincipal', 'urlAdicional1', 'urlAdicional2', 'urlAdicional3'].map((campo, index) => (
                    <Form.Group className="mb-3" key={index}>
                      <Form.Label>{campo.charAt(0).toUpperCase() + campo.slice(1).replace(/([A-Z])/g, ' $1')}</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData[campo]}
                        onChange={(e) => setFormData({ ...formData, [campo]: e.target.value })}
                        required
                        placeholder={`Ex: ${campo.charAt(0).toUpperCase() + campo.slice(1)}`}
                      />
                    </Form.Group>
                  ))}

                  <Form.Group className="mb-3 d-flex align-items-center">
                    <Form.Label className="me-2">Marca</Form.Label>
                    <Form.Select value={formData.marca} onChange={(e) => setFormData({ ...formData, marca: e.target.value })} required className="flex-grow-1">
                      <option value="">Selecione uma marca</option>
                      {marcas.map(m => <option key={m.id} value={m.nome}>{m.nome}</option>)}
                    </Form.Select>
                    <Button variant="link" onClick={() => handleShowModal('marca')} className="ms-2">
                      <FaPlus />
                    </Button>
                  </Form.Group>

                  <Form.Group className="mb-3 d-flex align-items-center">
                    <Form.Label className="me-2">Categoria</Form.Label>
                    <Form.Select value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} required className="flex-grow-1">
                      <option value="">Selecione uma categoria</option>
                      {categorias.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                    </Form.Select>
                    <Button variant="link" onClick={() => handleShowModal('categoria')} className="ms-2">
                      <FaPlus />
                    </Button>
                  </Form.Group>

                  <Form.Group className="mb-3 d-flex align-items-center">
                    <Form.Label className="me-2">Tamanho</Form.Label>
                    <Form.Select
                      value={formData.tamanho}
                      onChange={(e) => setFormData({ ...formData, tamanho: e.target.value })} // Atualiza o tamanho
                      required
                      className="flex-grow-1"
                    >
                      <option value="">Selecione um tamanho</option>
                      {tamanhos.map(t => (
                        <option key={t.id} value={t.tamanho}>{t.tamanho}</option> // Acesse a propriedade "tamanho" aqui
                      ))}
                    </Form.Select>
                    <Button variant="link" onClick={() => handleShowModal('tamanho')} className="ms-2">
                      <FaPlus />
                    </Button>
                  </Form.Group>


                  <Button variant="primary" type="submit" className="w-100 mb-2">
                    {produtoSelecionado ? 'Salvar Produto' : 'Cadastrar Produto'}
                  </Button>

                  <Button variant="secondary" onClick={() => {
                    setFormData({
                      nome: '',
                      valor: '',
                      valorOriginal: '',
                      urlPrincipal: '',
                      urlAdicional1: '',
                      urlAdicional2: '',
                      urlAdicional3: '',
                      marca: '',
                      categoria: '',
                      tamanho: '' // Redefina o tamanho aqui
                    });
                    setProdutoSelecionado(null); // Limpa a seleção do produto
                  }} className="w-100">
                    Novo Produto
                  </Button>

                </Form>
              </>
            ) : (
              <Alert variant="danger" className="text-center">
                Você não tem permissão para acessar esta página.

              </Alert>
            )}
          </Card>
        </Col>
        <Col>
          <Card className="p-4">
            <h2 className="text-center mb-4">Produtos Cadastrados</h2>
            <ul className="list-unstyled">
              {produtos.map(produto => (
                <li key={produto.id} className="d-flex align-items-center justify-content-between mb-3">
                  <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', marginRight: '10px' }}>
                    <img src={produto.urlPrincipal} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <Button variant="link" onClick={() => selecionarProduto(produto)} className="flex-grow-1">
                    {produto.nome} - {produto.marca} - {produto.categoria}
                  </Button>
                  <Button variant="link" onClick={() => handleShowModalConfirmacao(produto.id)} className="text-danger">
                    <FaTrash />
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>

      <Row className="my-5">

      </Row>

      {/* Modal para adicionar marcas ou categorias */}
      <Modal show={modalVisible} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {tipoCadastro === 'marca'
              ? 'Adicionar Marca'
              : tipoCadastro === 'categoria'
                ? 'Adicionar Categoria'
                : 'Adicionar Tamanho'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nome da {tipoCadastro === 'marca' ? 'Marca' : tipoCadastro === 'categoria' ? 'Categoria' : 'Tamanho'}</Form.Label>
            <Form.Control
              type="text"
              value={novoItem}
              onChange={(e) => setNovoItem(e.target.value)}
              placeholder={`Nome da ${tipoCadastro === 'marca' ? 'Marca' : tipoCadastro === 'categoria' ? 'Categoria' : 'Tamanho'}`}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Fechar</Button>
          <Button variant="primary" onClick={handleCadastrarNovoItem}>Adicionar</Button>
        </Modal.Footer>
      </Modal>


      {/* Modal de confirmação de exclusão */}
      <Modal show={modalConfirmacaoVisible} onHide={handleCloseModalConfirmacao}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Confirmar exclusão do produto?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalConfirmacao}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteProduto}>Confirmar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
