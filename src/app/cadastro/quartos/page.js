'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, Container, Row, Col, Card, Alert, Modal } from 'react-bootstrap';
import Select from 'react-select';
import Pagina from '@/app/components/Pagina';

export default function CadastrarQuarto() {
  const [formData, setFormData] = useState({
    nome: '',
    precoPorNoite: '',
    tipoCama: '',
    ocupacaoMaxima: '',
    urlImagem: '',
    tipo: ''
  });

  const [usuarioMaster, setUsuarioMaster] = useState(null);
  const [quartos, setQuartos] = useState([]);
  const [quartoSelecionado, setQuartoSelecionado] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoTipo, setNovoTipo] = useState('');
  const [modalConfirmacaoVisible, setModalConfirmacaoVisible] = useState(false);
  const [quartoParaExcluir, setQuartoParaExcluir] = useState(null);
  const roteador = useRouter();

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    setUsuarioMaster(usuarioLogado?.usuario === 'master');
    setQuartos(JSON.parse(localStorage.getItem('quartos')) || []);
    setTipos(JSON.parse(localStorage.getItem('tipos')) || []);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const quartosCadastrados = JSON.parse(localStorage.getItem('quartos')) || [];
    
    const novoQuarto = {
      id: quartoSelecionado ? quartoSelecionado.id : (quartosCadastrados.length ? Math.max(...quartosCadastrados.map(q => q.id)) + 1 : 1),
      ...formData,
    };

    if (quartoSelecionado) {
      const index = quartosCadastrados.findIndex(quarto => quarto.id === quartoSelecionado.id);
      if (index !== -1) {
        quartosCadastrados[index] = novoQuarto; // Atualiza o quarto existente
      }
    } else {
      quartosCadastrados.push(novoQuarto); // Adiciona um novo quarto
    }

    localStorage.setItem('quartos', JSON.stringify(quartosCadastrados));
    setQuartos(quartosCadastrados);
    resetForm();
    alert('Quarto salvo com sucesso!');
  };

  const selecionarQuarto = (quarto) => {
    setQuartoSelecionado(quarto);
    setFormData({
      nome: quarto.nome,
      precoPorNoite: quarto.precoPorNoite,
      tipoCama: quarto.tipoCama,
      ocupacaoMaxima: quarto.ocupacaoMaxima,
      urlImagem: quarto.urlImagem,
      tipo: quarto.tipo
    });
  };

  const resetForm = () => {
    setQuartoSelecionado(null);
    setFormData({
      nome: '',
      precoPorNoite: '',
      tipoCama: '',
      ocupacaoMaxima: '',
      urlImagem: '',
      tipo: ''
    });
  };

  const handleShowModalConfirmacao = (id) => {
    setQuartoParaExcluir(id);
    setModalConfirmacaoVisible(true);
  };

  const handleCloseModalConfirmacao = () => {
    setModalConfirmacaoVisible(false);
    setQuartoParaExcluir(null);
  };

  const handleDeleteQuarto = () => {
    const quartosCadastrados = JSON.parse(localStorage.getItem('quartos')) || [];
    const quartosFiltrados = quartosCadastrados.filter(quarto => quarto.id !== quartoParaExcluir);
    localStorage.setItem('quartos', JSON.stringify(quartosFiltrados));
    setQuartos(quartosFiltrados);
    handleCloseModalConfirmacao();
    alert('Quarto excluído com sucesso!');
  };

  const handleShowModalTipo = () => setModalVisible(true);
  const handleCloseModalTipo = () => setModalVisible(false);

  const handleAddTipo = () => {
    if (!novoTipo.trim()) return;
    const tiposCadastrados = JSON.parse(localStorage.getItem('tipos')) || [];
    
    const novoTipoObj = { id: tiposCadastrados.length + 1, nome: novoTipo };
    tiposCadastrados.push(novoTipoObj);
    
    localStorage.setItem('tipos', JSON.stringify(tiposCadastrados));
    setTipos(tiposCadastrados);
    setNovoTipo('');
    handleCloseModalTipo();
    alert('Tipo adicionado com sucesso!');
  };

  return (
    <Pagina>
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col>
            <Card className="p-4 shadow-lg">
              <h2 className="text-center mb-4">Cadastrar Quarto</h2>
              {usuarioMaster ? (
                <Form onSubmit={handleSubmit}>
                  {['nome', 'urlImagem'].map((campo, index) => (
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
                    <Form.Label>Preço por Noite</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.precoPorNoite}
                      onChange={(e) => setFormData({ ...formData, precoPorNoite: e.target.value })}
                      required
                      placeholder="Ex: 200.00"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Cama</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.tipoCama}
                      onChange={(e) => setFormData({ ...formData, tipoCama: e.target.value })}
                      required
                      placeholder="Ex: Casal, Solteiro"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Ocupação Máxima</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.ocupacaoMaxima}
                      onChange={(e) => setFormData({ ...formData, ocupacaoMaxima: e.target.value })}
                      required
                      placeholder="Ex: 2"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tipo</Form.Label>
                    <div className="d-flex align-items-center">
                      <Select
                        options={tipos.map(tipo => ({ label: tipo.nome, value: tipo.nome }))}
                        value={formData.tipo ? { label: formData.tipo, value: formData.tipo } : null}
                        onChange={(e) => setFormData({ ...formData, tipo: e.value })}
                      />
                      <Button variant="link" onClick={handleShowModalTipo} className="ms-2">Adicionar Tipo</Button>
                    </div>
                  </Form.Group>

                  <div className="d-flex justify-content-end gap-2">
                    <Button variant="success" type="submit">{quartoSelecionado ? 'Atualizar' : 'Salvar'}</Button>
                    <Button variant="warning" onClick={resetForm}>Limpar</Button>
                  </div>
                </Form>
              ) : (
                <Alert variant="danger" className="text-center">Acesso restrito ao usuário master.</Alert>
              )}
            </Card>
          </Col>
        </Row>

        <Row className="my-4">
          <Col>
            <h2 className="text-center">Quartos Cadastrados</h2>
            {quartos.length === 0 ? (
              <Alert variant="info" className="text-center">Nenhum quarto cadastrado.</Alert>
            ) : (
              quartos.map(quarto => (
                <Card key={quarto.id} className="mb-3">
                  <Card.Body>
                    <Card.Title>{quarto.nome}</Card.Title>
                    <Card.Text>
                      <strong>Preço por Noite:</strong> {quarto.precoPorNoite} <br />
                      <strong>Tipo de Cama:</strong> {quarto.tipoCama} <br />
                      <strong>Ocupação Máxima:</strong> {quarto.ocupacaoMaxima} <br />
                      <strong>Tipo:</strong> {quarto.tipo}
                    </Card.Text>
                    <Button variant="info" onClick={() => selecionarQuarto(quarto)}>Editar</Button>
                    <Button variant="danger" onClick={() => handleShowModalConfirmacao(quarto.id)}>Excluir</Button>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>
        </Row>
      </Container>

      <Modal show={modalConfirmacaoVisible} onHide={handleCloseModalConfirmacao}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir o quarto?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalConfirmacao}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteQuarto}>Excluir</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={modalVisible} onHide={handleCloseModalTipo}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Tipo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nome do Tipo</Form.Label>
            <Form.Control type="text" value={novoTipo} onChange={(e) => setNovoTipo(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalTipo}>Cancelar</Button>
          <Button variant="success" onClick={handleAddTipo}>Salvar</Button>
        </Modal.Footer>
      </Modal>
    </Pagina>
  );
}
