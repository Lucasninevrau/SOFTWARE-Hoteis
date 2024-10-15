'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner, Modal } from 'react-bootstrap';
import { FaPlus, FaTrash, FaUpload } from 'react-icons/fa';
import Pagina from '@/app/components/Pagina';
import Select from 'react-select';
import Papa from 'papaparse';


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
    tamanho: ''
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

  const router = useRouter();

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    setUsuarioMaster(usuarioLogado?.usuario === 'master');
    setProdutos(JSON.parse(localStorage.getItem('produtos')) || []);
    setMarcas(JSON.parse(localStorage.getItem('marcas')) || []);
    setCategorias(JSON.parse(localStorage.getItem('categorias')) || []);
    setTamanhos(JSON.parse(localStorage.getItem('tamanhos')) || []);


  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Obtém o arquivo selecionado
    if (!file) return;

    // Usa o PapaParse para ler o arquivo CSV
    Papa.parse(file, {
      header: true, // Para usar a primeira linha como cabeçalho
      skipEmptyLines: true, // Pula as linhas vazias
      complete: function (results) {
        const produtosCSV = results.data; // Resultados do CSV
        const produtosCadastrados = JSON.parse(localStorage.getItem('produtos')) || [];
        const marcasCadastradas = JSON.parse(localStorage.getItem('marcas')) || [];
        const categoriasCadastradas = JSON.parse(localStorage.getItem('categorias')) || [];
        const tamanhosCadastrados = JSON.parse(localStorage.getItem('tamanhos')) || [];

        // Função auxiliar para verificar se um item já existe em uma lista
        const itemExiste = (lista, chave, valor) => lista.some(item => item[chave] === valor);

        // Concatena os produtos do CSV com os já cadastrados
        const novosProdutos = produtosCadastrados.concat(produtosCSV.map((produto, index) => {
          // Verifica e cadastra a marca se não existir
          if (!itemExiste(marcasCadastradas, 'nome', produto.marca)) {
            const novaMarca = { id: marcasCadastradas.length + 1, nome: produto.marca };
            marcasCadastradas.push(novaMarca);
          }

          // Verifica e cadastra a categoria se não existir
          if (!itemExiste(categoriasCadastradas, 'nome', produto.categoria)) {
            const novaCategoria = { id: categoriasCadastradas.length + 1, nome: produto.categoria };
            categoriasCadastradas.push(novaCategoria);
          }

          // Verifica e cadastra o tamanho se não existir
          if (!itemExiste(tamanhosCadastrados, 'tamanho', produto.tamanho)) {
            const novoTamanho = { id: tamanhosCadastrados.length + 1, tamanho: produto.tamanho };
            tamanhosCadastrados.push(novoTamanho);
          }

          return {
            id: produtosCadastrados.length + index + 1,
            nome: produto.nome,
            valor: produto.valor,
            valorOriginal: produto.valorOriginal,
            urlPrincipal: produto.urlPrincipal,
            urlAdicional1: produto.urlAdicional1,
            urlAdicional2: produto.urlAdicional2,
            urlAdicional3: produto.urlAdicional3,
            marca: produto.marca,
            categoria: produto.categoria,
            tamanho: produto.tamanho,
            imagensAdicionais: [produto.urlAdicional1, produto.urlAdicional2, produto.urlAdicional3] // Adiciona as URLs adicionais
          };
        }));

        // Atualiza as listas de marcas, categorias e tamanhos no localStorage
        localStorage.setItem('marcas', JSON.stringify(marcasCadastradas));
        localStorage.setItem('categorias', JSON.stringify(categoriasCadastradas));
        localStorage.setItem('tamanhos', JSON.stringify(tamanhosCadastrados));

        // Salva os novos produtos no localStorage
        localStorage.setItem('produtos', JSON.stringify(novosProdutos));
        setProdutos(novosProdutos);
        setMarcas(marcasCadastradas);
        setCategorias(categoriasCadastradas);
        setTamanhos(tamanhosCadastrados);

        alert('Produtos importados e dados atualizados com sucesso!');
      },
      error: function (err) {
        alert('Erro ao processar o arquivo CSV: ' + err.message);
      }
    });
  };



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
      tamanho: produto.tamanho || '',
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
    } else if (tipoCadastro === 'tamanho') {
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

  // Função para formatar número como moeda
  const formatarValor = (valor) => {
    const cleanValue = valor.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
    if (cleanValue.length === 0) return '';

    // Converte para float e divide por 100 para transformar em valor monetário
    const floatValue = parseFloat(cleanValue) / 100;

    // Formata o número com 2 casas decimais
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(floatValue);
  };

  // Função para lidar com a mudança do valor
  const handleValueChange = (e, field) => {
    const { value } = e.target;

    // Atualiza o estado do formData com o valor digitado
    setFormData({ ...formData, [field]: value });

    // Formata o valor
    const formattedValue = formatarValor(value);
    setFormData((prevState) => ({ ...prevState, [field]: formattedValue }));
  };

  const handleBlur = (field) => {
    const cleanValue = formData[field].replace(',', '.'); // Substitui a vírgula pelo ponto
    const numberValue = parseFloat(cleanValue.replace(/[^\d.-]/g, '')); // Remove tudo exceto números e ponto
    setFormData({ ...formData, [field]: isNaN(numberValue) ? '' : formatarNumero(numberValue) });
  };

  return (
    <Pagina>
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col>
            <Card className="p-4 shadow-lg">
              <h2 className="text-center mb-4">Cadastrar Produto</h2>
              {usuarioMaster ? (
                <>
                  <Form onSubmit={handleSubmit}>
                    {['nome', 'urlPrincipal', 'urlAdicional1', 'urlAdicional2', 'urlAdicional3'].map((campo, index) => (
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
                    <Form.Group className="mb-3">
                      <Form.Label>Valor</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.valor}
                        onChange={(e) => handleValueChange(e, 'valor')}
                        required
                        placeholder="Ex: 100.00"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Valor Original</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.valorOriginal}
                        onChange={(e) => handleValueChange(e, 'valorOriginal')}
                        required
                        placeholder="Ex: 200.00"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center">
                      <Form.Label className="me-2">Marca</Form.Label>
                      <div className="flex-grow-1">
                        <Select
                          options={marcas.map(m => ({ value: m.nome, label: m.nome }))}
                          value={formData.marca ? { value: formData.marca, label: formData.marca } : null}
                          onChange={(selected) => setFormData({ ...formData, marca: selected.value })}
                          placeholder="Selecione uma marca"
                          required
                        />
                      </div>
                      <Button variant="link" onClick={() => handleShowModal('marca')} className="ms-2">
                        <FaPlus />
                      </Button>
                    </Form.Group>

                    <Form.Group className="mb-3 d-flex align-items-center">
                      <Form.Label className="me-2">Categoria</Form.Label>
                      <div className="flex-grow-1">
                        <Select
                          options={categorias.map(c => ({ value: c.nome, label: c.nome }))}
                          value={formData.categoria ? { value: formData.categoria, label: formData.categoria } : null}
                          onChange={(selected) => setFormData({ ...formData, categoria: selected.value })}
                          placeholder="Selecione uma categoria"
                          required
                        />
                      </div>
                      <Button variant="link" onClick={() => handleShowModal('categoria')} className="ms-2">
                        <FaPlus />
                      </Button>
                    </Form.Group>

                    <Form.Group className="mb-3 d-flex align-items-center">
                      <Form.Label className="me-2">Tamanho</Form.Label>
                      <div className="flex-grow-1">
                        <Select
                          options={tamanhos.map(t => ({ value: t.tamanho, label: t.tamanho }))}
                          value={formData.tamanho ? { value: formData.tamanho, label: formData.tamanho } : null}
                          onChange={(selected) => setFormData({ ...formData, tamanho: selected.value })}
                          placeholder="Selecione um tamanho"
                          required
                        />
                      </div>
                      <Button variant="link" onClick={() => handleShowModal('tamanho')} className="ms-2">
                        <FaPlus />
                      </Button>
                    </Form.Group>

                    {/* Botão para upload de CSV */}
                    <Form.Group className="mb-3">
                      <Form.Label>Importar Produtos via CSV</Form.Label>
                      <div className="d-flex align-items-center">
                        <Button as="label" variant="primary" className="me-3">
                          <FaUpload className="me-2" /> Upload CSV
                          <input
                            type="file"
                            accept=".csv"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                          />
                        </Button>
                        <span className="text-muted">Selecione um arquivo CSV</span>
                      </div>
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
                        tamanho: ''
                      });
                      setProdutoSelecionado(null);
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
            {usuarioMaster ? (
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
            ) : (
              <p></p>
            )}
          </Col>
        </Row>

        <Row className="my-5">

        </Row>

        
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
    </Pagina>
  );
}
