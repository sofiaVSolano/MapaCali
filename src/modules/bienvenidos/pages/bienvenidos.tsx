import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./bienvenidos.css";
import { Link } from "react-router-dom";
import { LatLngExpression } from 'leaflet';
import { Card, Typography, Row, Col, Button, Tag } from "antd";
import { EnvironmentOutlined, TeamOutlined, RocketOutlined, AppstoreOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export const BaseMap = () => {
  const MapRefresher = () => {
    const map = useMap();
    useEffect(() => {
      map.invalidateSize();
    }, [map]);
    return null;
  };

  const position: LatLngExpression = [3.4516, -76.5325];

  return (
    <div className="map-wrapper">
      <div className="map-overlay-info">
        <Card className="map-info-card">
          <Text strong style={{ fontSize: '16px' }}>📍 Santiago de Cali</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>Lat: 3.4516, Lng: -76.5325</Text>
        </Card>
      </div>
      <MapContainer center={position} zoom={12} style={{ height: "100vh", width: "100%" }}>
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />
        <MapRefresher />
      </MapContainer>
    </div>
  );
};

const SideMenu = () => {
  return (
    <div className="side-menu">
      <div className="side-menu-content">
        {/* Header con logo */}
        <div className="header-section">
          <div className="logo-container">
            <EnvironmentOutlined className="logo-icon" />
          </div>
          <Title level={2} className="main-title">
            Mapa Interactivo de Cali
          </Title>
          <Paragraph className="subtitle">
            <Tag color="green">Sistema GIS</Tag>
            <Tag color="blue">Visualización de Datos</Tag>
            <Tag color="purple">Análisis Espacial</Tag>
          </Paragraph>
        </div>

        {/* Introducción */}
        <Card className="intro-card" bordered={false}>
          <div className="card-icon">
            <RocketOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          </div>
          <Title level={4}>Acerca del Proyecto</Title>
          <Paragraph className="description">
            Plataforma interactiva para visualizar y analizar información geoespacial 
            de Santiago de Cali, incluyendo infraestructura urbana, estadísticas de seguridad, 
            y zonas de interés de las 22 comunas.
          </Paragraph>
        </Card>

        {/* Características */}
        <Card className="features-card" bordered={false}>
          <div className="card-icon">
            <AppstoreOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
          </div>
          <Title level={4}>Características</Title>
          <ul className="features-list">
            <li>📍 Marcadores de puntos de interés</li>
            <li>🗺️ Delimitación de 22 comunas</li>
            <li>🔥 Mapas de calor (homicidios, robos, accidentes)</li>
            <li>📸 Agregar imágenes con ubicación</li>
            <li>📊 Análisis y proyecciones de datos</li>
            <li>🎯 Clustering inteligente</li>
          </ul>
        </Card>

        {/* Imagen de la ciudad */}
        <div className="city-image-container">
          <img src="Icons/cali.jpg" alt="Santiago de Cali" className="city-image" />
          <div className="image-overlay">
            <Text strong style={{ color: 'white' }}>Santiago de Cali, Colombia</Text>
          </div>
        </div>

        {/* Integrantes */}
        <Card className="team-card" bordered={false}>
          <div className="card-icon">
            <TeamOutlined style={{ fontSize: '24px', color: '#faad14' }} />
          </div>
          <Title level={4}>Equipo de Desarrollo</Title>
          <div className="team-members">
            <div className="member">
              <div className="member-avatar">MC</div>
              <Text strong>Mariana Cruz</Text>
            </div>
            <div className="member">
              <div className="member-avatar">SV</div>
              <Text strong>Sofia Valencia</Text>
            </div>
            <div className="member">
              <div className="member-avatar">MR</div>
              <Text strong>Maria Jose Ramirez</Text>
            </div>
          </div>
        </Card>

        {/* Botones de navegación */}
        <div className="navigation-section">
          <Title level={5} style={{ marginBottom: '16px', textAlign: 'center' }}>
            Explorar el Sistema
          </Title>
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Link to="/map" className="nav-link">
                <Button type="primary" size="large" block className="nav-button primary">
                  🗺️ Mapa Principal
                </Button>
              </Link>
            </Col>
            <Col span={12}>
              <Link to="/api-google" className="nav-link">
                <Button size="large" block className="nav-button google">
                  🌐 API Google
                </Button>
              </Link>
            </Col>
            <Col span={12}>
              <Link to="/proyecciones" className="nav-link">
                <Button size="large" block className="nav-button proyecciones">
                  📈 Proyecciones
                </Button>
              </Link>
            </Col>
            <Col span={12}>
              <Link to="/cluster" className="nav-link">
                <Button size="large" block className="nav-button cluster">
                  🎯 Clustering
                </Button>
              </Link>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export const Bienvenidos = () => {
  return (
    <div className="main-container">
      <SideMenu />
      <div className="map-container">
        <BaseMap />
      </div>
    </div>
  );
};
