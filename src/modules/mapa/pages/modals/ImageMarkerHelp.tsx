/* Componente de ayuda para mostrar instrucciones sobre cómo usar las imágenes */
import { Card, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

export const ImageMarkerHelp = () => {
  return (
    <Card
      size="small"
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        width: "300px",
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
        <InfoCircleOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
        <Text strong>Cómo agregar imágenes</Text>
      </div>
      <Paragraph style={{ fontSize: "12px", marginBottom: "4px" }}>
        1. Click en "Agregar Imagen"
      </Paragraph>
      <Paragraph style={{ fontSize: "12px", marginBottom: "4px" }}>
        2. Ingresa coordenadas (Lat/Lng)
      </Paragraph>
      <Paragraph style={{ fontSize: "12px", marginBottom: "4px" }}>
        3. Selecciona una imagen (máx 5MB)
      </Paragraph>
      <Paragraph style={{ fontSize: "12px", marginBottom: 0 }}>
        4. Las imágenes aparecerán como marcadores en el mapa
      </Paragraph>
    </Card>
  );
};

export default ImageMarkerHelp;
