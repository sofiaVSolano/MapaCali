/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined, PictureOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import { crearMarcadorImagen } from "../../../../services/mapita/mapitaAPI";

export interface ImageMarkerData {
  nombre: string;
  lat: number;
  lng: number;
  imageUrl: string;
  imageFile?: File;
}

interface CreateImageMarkerModalProps {
  isVisible: boolean;
  onCreate: (marker: ImageMarkerData) => void;
  onClose: () => void;
}

const CreateImageMarkerModal = ({
  isVisible,
  onCreate,
  onClose,
}: CreateImageMarkerModalProps) => {
  const [form] = Form.useForm();
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleFormSubmit = async (values: any) => {
    if (!lat || !lng) {
      message.error("Por favor ingresa las coordenadas");
      return;
    }

    if (fileList.length === 0) {
      message.error("Por favor selecciona una imagen");
      return;
    }

    const newImageMarker: ImageMarkerData = {
      nombre: values.nombre || "Imagen sin nombre",
      lat: lat,
      lng: lng,
      imageUrl: imagePreview,
      imageFile: fileList[0].originFileObj as File,
    };

    // Intentar guardar en la API
    try {
      await crearMarcadorImagen({
        nombre: newImageMarker.nombre,
        lat: newImageMarker.lat,
        lng: newImageMarker.lng,
        imageUrl: newImageMarker.imageUrl
      });
      console.log('%cMarcador de imagen guardado en la API', 'color:blue;font-weight:bold');
    } catch (error) {
      console.error('Error al guardar marcador de imagen en la API:', error);
      // Continuar de todos modos - se guardará en localStorage
    }

    onCreate(newImageMarker);
    message.success("Imagen agregada al mapa correctamente");

    // Resetear formulario
    form.resetFields();
    setLat(undefined);
    setLng(undefined);
    setFileList([]);
    setImagePreview("");
    onClose();
  };

  const handleUploadChange = (info: any) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // Solo mantener la última imagen

    setFileList(newFileList);

    if (info.file.status !== "uploading") {
      const file = info.file.originFileObj;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Solo puedes subir archivos de imagen");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("La imagen debe ser menor a 5MB");
      return false;
    }

    return false; // Prevenir upload automático
  };

  const handleCancel = () => {
    form.resetFields();
    setLat(undefined);
    setLng(undefined);
    setFileList([]);
    setImagePreview("");
    onClose();
  };

  return (
    <Modal
      title={
        <span>
          <PictureOutlined style={{ marginRight: 8 }} />
          Agregar Imagen al Mapa
        </span>
      }
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form form={form} onFinish={handleFormSubmit} layout="vertical">
        <Form.Item
          name="nombre"
          label="Nombre/Descripción (opcional)"
          tooltip="Agrega una descripción para identificar la imagen"
        >
          <Input placeholder="Ej: Vista panorámica del centro" />
        </Form.Item>

        <Form.Item
          label="Coordenadas de ubicación"
          required
          tooltip="Ingresa la latitud y longitud donde deseas colocar la imagen"
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              border: "1px solid #d9d9d9",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", color: "#666" }}>
                Latitud
              </label>
              <Input
                placeholder="3.449378"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
                type="number"
                step="0.000001"
                style={{ marginTop: "4px" }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", color: "#666" }}>
                Longitud
              </label>
              <Input
                placeholder="-76.5452443"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value))}
                type="number"
                step="0.000001"
                style={{ marginTop: "4px" }}
              />
            </div>
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#999",
              marginTop: "4px",
            }}
          >
            Coordenadas de Cali: Lat: 3.4 a 3.5, Lng: -76.6 a -76.5
          </div>
        </Form.Item>

        <Form.Item
          label="Seleccionar imagen"
          required
          tooltip="Sube una imagen (JPG, PNG, máx 5MB)"
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={beforeUpload}
            accept="image/*"
            maxCount={1}
          >
            {fileList.length === 0 && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Subir imagen</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        {imagePreview && (
          <div
            style={{
              marginBottom: "20px",
              padding: "10px",
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
            }}
          >
            <div style={{ marginBottom: "8px", fontWeight: "500" }}>
              Vista previa:
            </div>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "4px",
              }}
            />
          </div>
        )}

        <Form.Item style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", gap: "10px", justifyContent: "end" }}>
            <Button onClick={handleCancel}>Cancelar</Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!lat || !lng || fileList.length === 0}
            >
              Agregar al Mapa
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateImageMarkerModal;
