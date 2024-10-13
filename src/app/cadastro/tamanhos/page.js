'use client'; // Certifique-se de usar isso para que o hook do router funcione

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

export default function CadastrarTamanho() {
    const [tamanho, setTamanho] = useState('');
    const [usuarioMaster, setUsuarioMaster] = useState(null);
    const [tamanhos, setTamanhos] = useState([]);
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

        // Verifica se o usuário é o "master"
        if (usuarioLogado && usuarioLogado.usuario === 'master') {
            setUsuarioMaster(true);
        } else {
            setUsuarioMaster(false);
        }

        // Carrega os tamanhos do localStorage
        const tamanhosCadastrados = JSON.parse(localStorage.getItem('tamanhos')) || [];
        setTamanhos(tamanhosCadastrados);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const tamanhosCadastrados = JSON.parse(localStorage.getItem('tamanhos')) || [];
        const novoTamanho = {
            id: tamanhoSelecionado ? tamanhoSelecionado.id : tamanhosCadastrados.length + 1,
            tamanho,
        };

        if (tamanhoSelecionado) {
            // Atualiza o tamanho existente
            const index = tamanhosCadastrados.findIndex(t => t.id === tamanhoSelecionado.id);
            tamanhosCadastrados[index] = novoTamanho;
        } else {
            // Adiciona um novo tamanho
            tamanhosCadastrados.push(novoTamanho);
        }

        // Atualiza o localStorage
        localStorage.setItem('tamanhos', JSON.stringify(tamanhosCadastrados));

        // Atualiza o estado para re-renderizar a lista de tamanhos
        setTamanhos(tamanhosCadastrados);
        limparFormulario();
        alert('Tamanho salvo com sucesso!');
    };

    const limparFormulario = () => {
        setTamanho('');
        setTamanhoSelecionado(null);
    };

    const selecionarTamanho = (tamanho) => {
        setTamanhoSelecionado(tamanho);
        setTamanho(tamanho.tamanho);
    };

    const excluirTamanho = (id) => {
        const tamanhosAtualizados = tamanhos.filter(t => t.id !== id);
        setTamanhos(tamanhosAtualizados);
        localStorage.setItem('tamanhos', JSON.stringify(tamanhosAtualizados));
    };

    if (usuarioMaster === null) {
        // Exibe um spinner enquanto a verificação é feita
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
                        <h2 className="text-center mb-4">Cadastrar Tamanho</h2>

                        {usuarioMaster ? (
                            <>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tamanho</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tamanho}
                                            onChange={(e) => setTamanho(e.target.value)}
                                            required
                                            placeholder="Ex: P, M, G, GG"
                                        />
                                    </Form.Group>

                                    <Button variant="primary" type="submit" className="w-100 mb-2">
                                        {tamanhoSelecionado ? 'Salvar Tamanho' : 'Cadastrar Tamanho'}
                                    </Button>

                                    <Button variant="secondary" onClick={limparFormulario} className="w-100">
                                        Novo Tamanho
                                    </Button>
                                </Form>
                            </>
                        ) : (
                            <Alert variant="danger" className="text-center">
                                Você não tem permissão para cadastrar tamanhos.
                            </Alert>
                        )}
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="p-4 shadow-lg">
                        <h2 className="text-center mb-4">Tamanhos Cadastrados</h2>
                        <ul className="list-unstyled">
                            {tamanhos.map((t) => (
                                <li key={t.id} className="mb-3 d-flex justify-content-between align-items-center">
                                    <Button variant="link" onClick={() => selecionarTamanho(t)}>
                                        {t.tamanho}
                                    </Button>
                                    <Button variant="danger" onClick={() => excluirTamanho(t.id)}>
                                        <FaTrash />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
