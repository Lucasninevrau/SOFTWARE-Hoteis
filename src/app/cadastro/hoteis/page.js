'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, Container, Row, Col, Card, Alert, Modal } from 'react-bootstrap';
import Select from 'react-select';
import Papa from 'papaparse';
import Pagina from '@/app/components/Pagina';

export default function CadastrarHotel() {
  const [formData, setFormData] = useState({
    nome: '',
    precoPorNoite: '',
    estrelas: '',
    urlPrincipal: '',
    urlAdicional1: '',
    urlAdicional2: '',
    urlAdicional3: '',
    localizacao: '',
    tipo: '',
    quartos: [],
  });
  const [quartos, setQuartos] = useState([]);
  const [usuarioMaster, setUsuarioMaster] = useState(null);
  const [hoteis, setHoteis] = useState([]);
  const [hotelSelecionado, setHotelSelecionado] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoTipo, setNovoTipo] = useState('');
  const [modalConfirmacaoVisible, setModalConfirmacaoVisible] = useState(false);
  const [hotelParaExcluir, setHotelParaExcluir] = useState(null);
  const roteador = useRouter();

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    setUsuarioMaster(usuarioLogado?.usuario === 'master');
    setHoteis(JSON.parse(localStorage.getItem('hoteis')) || []);
    setTipos(JSON.parse(localStorage.getItem('tipos')) || []);
    const quartosCadastrados = JSON.parse(localStorage.getItem('quartos')) || [];
    setQuartos(quartosCadastrados); // Define os quartos disponíveis
  }, []);

  const handleSelectQuarto = (quartoId) => {
    setFormData((prev) => {
      const quartosSelecionados = prev.quartos.includes(quartoId)
        ? prev.quartos.filter(id => id !== quartoId) // Remove o quarto se já estiver selecionado
        : [...prev.quartos, quartoId]; // Adiciona o quarto se não estiver selecionado
      return { ...prev, quartos: quartosSelecionados };
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const hoteisCSV = results.data;
        const hoteisCadastrados = JSON.parse(localStorage.getItem('hoteis')) || [];
        const tiposCadastrados = JSON.parse(localStorage.getItem('tipos')) || [];

        const itemExiste = (lista, chave, valor) => lista.some(item => item[chave] === valor);

        const novosHoteis = hoteisCadastrados.concat(hoteisCSV.map((hotel, index) => {
          if (!itemExiste(tiposCadastrados, 'nome', hotel.tipo)) {
            tiposCadastrados.push({ id: tiposCadastrados.length + 1, nome: hotel.tipo });
          }

          return {
            id: hoteisCadastrados.length + index + 1,
            nome: hotel.nome,
            precoPorNoite: hotel.precoPorNoite,
            estrelas: hotel.estrelas,
            urlPrincipal: hotel.urlPrincipal,
            urlAdicional1: hotel.urlAdicional1,
            urlAdicional2: hotel.urlAdicional2,
            urlAdicional3: hotel.urlAdicional3,
            localizacao: hotel.localizacao,
            tipo: hotel.tipo,
            quartos: hotel.quartos || [],
            imagensAdicionais: [hotel.urlAdicional1, hotel.urlAdicional2, hotel.urlAdicional3]
          };
        }));

        localStorage.setItem('tipos', JSON.stringify(tiposCadastrados));
        localStorage.setItem('hoteis', JSON.stringify(novosHoteis));
        setHoteis(novosHoteis);
        setTipos(tiposCadastrados);

        alert('Hotéis importados e dados atualizados com sucesso!');
      },
      error: (err) => {
        alert('Erro ao processar o arquivo CSV: ' + err.message);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hoteisCadastrados = JSON.parse(localStorage.getItem('hoteis')) || [];
    const novoHotel = {
      id: hotelSelecionado ? hotelSelecionado.id : hoteisCadastrados.length + 1,
      ...formData,
      imagensAdicionais: [formData.urlAdicional1, formData.urlAdicional2, formData.urlAdicional3],
    };

    if (hotelSelecionado) {
      // Editar hotel
      Object.assign(hoteisCadastrados.find(hotel => hotel.id === hotelSelecionado.id), novoHotel);
    } else {
      // Adicionar novo hotel
      hoteisCadastrados.push(novoHotel);
    }

    localStorage.setItem('hoteis', JSON.stringify(hoteisCadastrados));
    setHoteis(hoteisCadastrados);
    resetForm();
    alert('Hotel salvo com sucesso!');
  };

  const selecionarHotel = (hotel) => {
    setHotelSelecionado(hotel);
    setFormData({
      nome: hotel.nome,
      precoPorNoite: hotel.precoPorNoite,
      estrelas: hotel.estrelas,
      urlPrincipal: hotel.urlPrincipal,
      localizacao: hotel.localizacao,
      tipo: hotel.tipo,
      quartos: [],
      urlAdicional1: hotel.imagensAdicionais[0] || '',
      urlAdicional2: hotel.imagensAdicionais[1] || '',
      urlAdicional3: hotel.imagensAdicionais[2] || ''
    });
  };

  const resetForm = () => {
    setHotelSelecionado(null);
    setFormData({
      nome: '',
      precoPorNoite: '',
      estrelas: '',
      urlPrincipal: '',
      urlAdicional1: '',
      urlAdicional2: '',
      urlAdicional3: '',
      localizacao: '',
      tipo: '',
      quartos: []
    });
  };

  const handleShowModalConfirmacao = (id) => {
    setHotelParaExcluir(id);
    setModalConfirmacaoVisible(true);
  };

  const handleCloseModalConfirmacao = () => {
    setModalConfirmacaoVisible(false);
    setHotelParaExcluir(null);
  };

  const handleDeleteHotel = () => {
    const hoteisCadastrados = JSON.parse(localStorage.getItem('hoteis')) || [];
    const hoteisFiltrados = hoteisCadastrados.filter(hotel => hotel.id !== hotelParaExcluir);
    localStorage.setItem('hoteis', JSON.stringify(hoteisFiltrados));
    setHoteis(hoteisFiltrados);
    handleCloseModalConfirmacao();
    alert('Hotel excluído com sucesso!');
  };

  const handleShowModalTipo = () => setModalVisible(true);
  const handleCloseModalTipo = () => setModalVisible(false);

  const handleAddTipo = () => {
    if (!novoTipo.trim()) return; // Não permite adicionar tipo vazio
    const tiposCadastrados = JSON.parse(localStorage.getItem('tipos')) || [];

    // Adiciona o novo tipo
    const novoTipoObj = { id: tiposCadastrados.length + 1, nome: novoTipo };
    tiposCadastrados.push(novoTipoObj);

    localStorage.setItem('tipos', JSON.stringify(tiposCadastrados));
    setTipos(tiposCadastrados);
    setNovoTipo(''); // Limpa o campo
    handleCloseModalTipo();
    alert('Tipo adicionado com sucesso!');
  };

  return (
    <Pagina>
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col>
            <Card className="p-4 shadow-lg">
              <h2 className="text-center mb-4">Cadastrar Hotel</h2>
              {usuarioMaster ? (
                <Form onSubmit={handleSubmit}>
                  {['nome', 'localizacao', 'urlPrincipal', 'urlAdicional1', 'urlAdicional2', 'urlAdicional3'].map((campo, index) => (
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
                    <Form.Label>Tipo</Form.Label>
                    <Select
                      options={tipos.map(tipo => ({ value: tipo.nome, label: tipo.nome }))}
                      value={tipos.find(tipo => tipo.nome === formData.tipo) ? { value: formData.tipo, label: formData.tipo } : null}
                      onChange={(opcao) => setFormData({ ...formData, tipo: opcao.value })}
                      placeholder="Selecione um tipo"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Estrelas</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="5"
                      value={formData.estrelas}
                      onChange={(e) => setFormData({ ...formData, estrelas: e.target.value })}
                      required
                      placeholder="1 a 5"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Preço por Noite</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.precoPorNoite}
                      onChange={(e) => setFormData({ ...formData, precoPorNoite: e.target.value })}
                      required
                      placeholder="Preço em R$"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Quartos</Form.Label>
                    <div>
                      {quartos.map(quarto => (
                        <Form.Check
                          key={quarto.id}
                          type="checkbox"
                          label={quarto.nome}
                          checked={formData.quartos.includes(quarto)}
                          onChange={() => handleSelectQuarto(quarto)}
                        />
                      ))}
                    </div>
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    {hotelSelecionado ? 'Salvar Alterações' : 'Cadastrar Hotel'}
                  </Button>

                  <Button variant="secondary" className="ms-2" onClick={resetForm}>
                    Cancelar
                  </Button>
                </Form>
              ) : (
                <Alert variant="warning">Você não tem permissão para cadastrar hotéis.</Alert>
              )}
            </Card>
          </Col>
        </Row>

        <Row className="my-4">
          <Col>
            <h3 className="text-center">Hotéis Cadastrados</h3>
            <ul>
              {hoteis.map(hotel => (
                <li key={hotel.id}>
                  {hotel.nome} - {hotel.localizacao} 
                  <Button variant="link" onClick={() => selecionarHotel(hotel)}>Editar</Button>
                  <Button variant="link" onClick={() => handleShowModalConfirmacao(hotel.id)} className="text-danger">Excluir</Button>
                </li>
              ))}
            </ul>
          </Col>
        </Row>

        <Modal show={modalVisible} onHide={handleCloseModalTipo}>
          <Modal.Header closeButton>
            <Modal.Title>Cadastrar Novo Tipo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Nome do Tipo</Form.Label>
              <Form.Control 
                type="text" 
                value={novoTipo} 
                onChange={(e) => setNovoTipo(e.target.value)} 
                placeholder="Nome do novo tipo" 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModalTipo}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleAddTipo}>
              Adicionar Tipo
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={modalConfirmacaoVisible} onHide={handleCloseModalConfirmacao}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Tem certeza que deseja excluir este hotel?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModalConfirmacao}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteHotel}>
              Excluir
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Pagina>
  );
}
