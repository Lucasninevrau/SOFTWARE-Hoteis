'use client';

import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

export default function Rodape() {
    return (
        <footer style={{ backgroundColor: "#000", color: "#fff", padding: "40px 0" }}>
            <Container>
                <Row className="text-center text-md-start">
                    {/* Sobre Nós */}
                    <Col md={3} className="mb-4">
                        <h5 style={{ color: '#fff', fontWeight: 'bold' }}>Sobre Nós</h5>
                        <p style={{ color: '#dcdcdc' }}>Oferecemos hotéis de qualidade, nossa missão é garantir sua satisfação.</p>
                    </Col>

                    {/* Links Úteis */}
                    <Col md={3} className="mb-4">
                        <h5 style={{ color: '#fff', fontWeight: 'bold' }}>Links Úteis</h5>
                        <ul className="list-unstyled">
                            <li><a href="/informacoes#politica-de-privacidade" style={{ color: '#dcdcdc', textDecoration: 'none' }}>Política de Privacidade</a></li>
                            <li><a href="/informacoes#termos-de-servico" style={{ color: '#dcdcdc', textDecoration: 'none' }}>Termos de Serviço</a></li>
                            <li><a href="/informacoes#suporte" style={{ color: '#dcdcdc', textDecoration: 'none' }}>Suporte</a></li>
                            <li><a href="/informacoes#contato" style={{ color: '#dcdcdc', textDecoration: 'none' }}>Contato</a></li>
                        </ul>
                    </Col>

                    {/* Hoteis */}
                    <Col md={3} className="mb-4">
                        <h5 style={{ color: '#fff', fontWeight: 'bold' }}>Hotéis</h5>
                        <ul className="list-unstyled">
                            <li><a href="/" style={{ color: '#dcdcdc', textDecoration: 'none' }}>Lista de hotéis</a></li>
                        </ul>
                    </Col>

                    {/* Siga-nos */}
                    <Col md={3} className="mb-4 text-center">
                        <h5 style={{ color: '#fff', fontWeight: 'bold' }}>Siga-nos</h5>
                        <div className="d-flex justify-content-center">
                            <a href="#" style={{ color: '#dcdcdc', margin: '0 10px' }}><FaFacebookF size={24} /></a>
                            <a href="#" style={{ color: '#dcdcdc', margin: '0 10px' }}><FaInstagram size={24} /></a>
                            <a href="#" style={{ color: '#dcdcdc', margin: '0 10px' }}><FaTwitter size={24} /></a>
                            <a href="#" style={{ color: '#dcdcdc', margin: '0 10px' }}><FaLinkedinIn size={24} /></a>
                        </div>
                    </Col>
                </Row>

                {/* Divisória */}
                <hr style={{ borderColor: "#333", margin: "20px 0" }} />

                {/* Newsletter */}
                <Row className="text-center mb-4">
                    <Col md={12}>
                        <h5 style={{ color: '#fff', fontWeight: 'bold' }}>Receba nossas novidades</h5>
                        <Form className="d-flex justify-content-center mt-3">
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                style={{ maxWidth: "300px", marginRight: "10px", borderColor: '#333', color: '#fff', backgroundColor: '#333' }}
                            />
                            <Button variant="primary" style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}>Envie</Button>
                        </Form>
                    </Col>
                </Row>

                {/* Copyright */}
                <Row className="text-center">
                    <Col>
                        <p style={{ margin: 0, color: '#dcdcdc', fontSize: '14px' }}>
                            © 2024 H. Todos os direitos reservados.
                        </p>
                        <p style={{ margin: 0, color: '#dcdcdc', fontSize: '14px' }}>
                            Coded with ❤️ by Lucas Fernandes.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
