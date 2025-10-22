// InfoBox.tsx
import { Card, Tag, Typography } from 'antd';
import { InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const categoryColors: { [key: string]: { color: string; icon: string } } = {
  colegio: { color: "blue", icon: "🏫" },
  hospitales: { color: "gold", icon: "🏥" },
  universidades: { color: "magenta", icon: "🎓" },
  hoteles: { color: "red", icon: "🏨" },
  bancos: { color: "orange", icon: "🏦" },
  "centros comerciales": { color: "volcano", icon: "🛒" },
  monumentos: { color: "purple", icon: "🗿" },
  fotomultas: { color: "green", icon: "📷" },
  "estaciones mio": { color: "cyan", icon: "🚌" },
  biblioteca: { color: "geekblue", icon: "📚" },
  parques: { color: "lime", icon: "🌳" },
  cais: { color: "green", icon: "🚓" },
};

interface InfoBoxProps {
  visible: boolean;
  selectedTypes: Set<string>;
  onToggleCategory: (category: string) => void;
}

const InfoBox = ({ visible, selectedTypes, onToggleCategory }: InfoBoxProps) => {
  if (!visible) return null;

  const infoBoxStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    width: '280px',
    animation: 'slideInRight 0.5s ease-out',
  };

  return (
    <div style={infoBoxStyle}>
      <Card
        size="small"
        bordered={false}
        style={{
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.98)',
        }}
      >
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <InfoCircleOutlined style={{ fontSize: '18px', color: '#667eea' }} />
            <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
              Leyenda Interactiva
            </Title>
          </div>
          <Text style={{ fontSize: '11px', color: '#999', display: 'block', marginBottom: '4px' }}>
            Click para activar/desactivar marcadores
          </Text>
          {selectedTypes.size === 0 ? (
            <Text style={{ fontSize: '11px', color: '#999', fontWeight: 500 }}>
              ◦ Sin categorías seleccionadas — no se muestran marcadores
            </Text>
          ) : (
            <Text style={{ fontSize: '11px', color: '#667eea', fontWeight: 500 }}>
              {selectedTypes.size} categoría{selectedTypes.size > 1 ? 's' : ''} seleccionada{selectedTypes.size > 1 ? 's' : ''}
            </Text>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(categoryColors).map(([category, { color, icon }]) => {
            // Si no hay nada seleccionado, todos están "inactivos" visualmente
            // Si hay algo seleccionado, solo los seleccionados están activos
            const isActive = selectedTypes.has(category);
            const showingAll = selectedTypes.size === 0;
            
            return (
              <div
                key={category}
                onClick={() => onToggleCategory(category)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: isActive 
                    ? 'linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, rgba(255, 255, 255, 0.5) 100%)' 
                    : showingAll 
                      ? 'rgba(240, 240, 240, 0.8)' 
                      : '#f8f9fa',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  border: isActive ? '2px solid #667eea' : '2px solid transparent',
                  opacity: isActive ? 1 : showingAll ? 0.9 : 0.5,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{icon}</span>
                  <Text style={{ 
                    fontSize: '13px', 
                    fontWeight: isActive ? 600 : 500,
                    color: showingAll && !isActive ? '#666' : '#000'
                  }}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isActive && (
                      <>
                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
                        <Tag color="success" style={{ margin: 0, borderRadius: '6px', fontSize: '11px' }}>
                          Activo
                        </Tag>
                      </>
                    )}
                  <Tag color={color} style={{ margin: 0, borderRadius: '6px', fontSize: '11px' }}>
                    {color}
                  </Tag>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default InfoBox;
