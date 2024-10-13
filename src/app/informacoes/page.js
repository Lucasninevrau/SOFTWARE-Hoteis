'use client';

import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import Pagina from '../components/Pagina';

export default function Informacoes() {
    return (
        <Pagina>
        <Container style={{ marginTop: '40px' }}>
           
            <h2 className="text-center mb-5">Informações Importantes</h2>

            {/* Seção de Termos de Serviço */}
            <Row id="termos-de-servico" className="mb-5">
                <Col>
                    <h3>Termos de Serviço</h3>
                    <p>
                        Bem-vindo à nossa página de Termos de Serviço. Aqui, descrevemos os termos e condições de uso do nosso site e de nossos produtos.
                        Ao utilizar nossos serviços, você concorda com estes termos. Recomendamos que leia com atenção para garantir que entende todos os direitos
                        e obrigações ao usar nossa plataforma.
                    </p>
                    <p>
                        <strong>Uso da plataforma:</strong> O uso da nossa plataforma está sujeito às regras definidas aqui. Quaisquer violações podem resultar
                        na suspensão ou encerramento da sua conta.
                    </p>
                    
                </Col>
            </Row>

            
            <Row id="politica-de-privacidade" className="mb-5">
                <Col>
                    <h3>Política de Privacidade</h3>
                    <p>
                        Nossa Política de Privacidade foi desenvolvida para proteger suas informações pessoais e garantir a transparência no uso de dados.
                        Coletamos dados apenas com o consentimento do usuário e usamos essas informações para oferecer uma experiência personalizada.
                    </p>
                    <p>
                        <strong>Coleta de dados:</strong> Coletamos informações básicas como nome, e-mail e histórico de navegação para melhorar nossos serviços.
                        Seus dados não são compartilhados com terceiros sem o seu consentimento.
                    </p>
                    
                </Col>
            </Row>

            
            <Row id="contato" className="mb-5">
                <Col>
                    <h3>Contato</h3>
                    <p>
                        Se precisar de mais informações ou tiver dúvidas sobre nossos serviços, entre em contato conosco pelos meios abaixo:
                    </p>
                    <ul>
                        <li><strong>Email:</strong> suporte@empresa.com</li>
                        <li><strong>Telefone:</strong> (11) 1234-5678</li>
                        <li><strong>Endereço:</strong> Rua Exemplo, 123, Cidade, Estado</li>
                    </ul>
                </Col>
            </Row>

            
            <Row id="suporte" className="mb-5">
                <Col>
                    <h3>Formulário de Suporte</h3>
                    <p>Se precisar de ajuda, preencha o formulário abaixo que entraremos em contato o mais breve possível.</p>
                    <Form>
                        <Form.Group className="mb-3" controlId="nome">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type="text" placeholder="Digite seu nome" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Digite seu email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="mensagem">
                            <Form.Label>Mensagem</Form.Label>
                            <Form.Control as="textarea" rows={4} placeholder="Descreva sua dúvida ou problema" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Enviar
                        </Button>
                    </Form>
                </Col>
            </Row>

           
            <Row className="text-center">
                <Col>
                    <p>
                        <Link href="#termos-de-servico" style={{ marginRight: '15px' }}>Termos de Serviço</Link>
                        <Link href="#politica-de-privacidade" style={{ marginRight: '15px' }}>Política de Privacidade</Link>
                        <Link href="#contato" style={{ marginRight: '15px' }}>Contato</Link>
                        <Link href="#suporte">Formulário de Suporte</Link>
                    </p>
                </Col>
            </Row>
        </Container>
        </Pagina>
    );
}
