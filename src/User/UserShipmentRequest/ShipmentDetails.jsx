import React, { useState } from 'react';
import './ShipmentDetails.css';
import { Button, Checkbox, Form, Input, Row,Col, Card, Switch, Select, Divider, Tooltip, Radio, DatePicker, Table, Popconfirm, Dropdown, Space, Flex, Typography, InputNumber, Tabs, Alert  } from 'antd'
import {UserOutlined,LockOutlined, BookOutlined, FileDoneOutlined, FileTextOutlined, FileSyncOutlined, ProfileOutlined, QuestionCircleOutlined, DeleteOutlined, DownOutlined, CheckOutlined, BorderTopOutlined, PicCenterOutlined, PlusOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import { Option } from 'antd/es/mentions';
import "/node_modules/flag-icons/css/flag-icons.min.css";

const countryOptions = [
  'China', 'France', 'India', 'USA', 'Germany', 'Spain', 'Italy', 'UK', 'Switzerland', 'Japan', 'Australia', 'Brazil', 'Canada', 'Russia', 'South Africa'
];
const originTypeOptions = ['Factory/Warehouse', 'Port', 'Airport'];
const destinationTypeOptions = ['Business address', 'Retail Store', 'Warehouse', 'Port', 'Airport'];

const ShipmentDetailsShipment = () => {
    const [transportMode, setTransportMode] = useState('');
    const [cargoType, setCargoType] = useState({
        isFood: false,
        commodityCode: '',
        description: '',
        invoiceValue: '',
        incoterms: '',
    });
    const [isTempControlled, setIsTempControlled] = useState(false);
    const [temperature, setTemperature] = useState({ min: '', max: '' });
    const [collection, setCollection] = useState([{ date: '', forklift: false, reference: '', type: '' }]);
    const [pickup, setPickup] = useState([{ date: '', forklift: false, reference: '', type: '' }]);
    const [services, setServices] = useState({ cargoInsurance: false, portCharges: false });
    const [customs, setCustoms] = useState({
        exportClearance: { enabled: false, option: '' },
        importClearance: { enabled: false, option: '' },
    });
    const [attachments, setAttachments] = useState([]);
    const [origin, setOrigin] = useState({ type: '', country: '', address: '' });
    const [destination, setDestination] = useState({ type: '', country: '', address: '' });
    const [doctype, setDoctype] = useState('');
    const [loadsUnits, setLoadsUnits] = useState('');
    const [loadsTotalCbm, setLoadsTotalCbm] = useState('');
    const [loadsTotalWeight, setLoadsTotalWeight] = useState('');
    const [goodsValue, setGoodsValue] = useState('');
    const [goodsReady, setGoodsReady] = useState('');

    const handleCollectionChange = (index, field, value) => {
        const updated = [...collection];
        updated[index][field] = value;
        setCollection(updated);
    };

    const handlePickupChange = (index, field, value) => {
        const updated = [...pickup];
        updated[index][field] = value;
        setPickup(updated);
    };

    const handleFileUpload = (event) => {
        setAttachments([...attachments, ...event.target.files]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('service_type', 'Shipment');
        formData.append('transport_mode', transportMode);
        formData.append('is_food_product', cargoType.isFood ? '1' : '0');
        formData.append('product_commodity_code', cargoType.commodityCode);
        formData.append('good_description', cargoType.description);
        formData.append('invoice_value', cargoType.invoiceValue);
        formData.append('payment_incoterms', cargoType.incoterms);
        formData.append('origin_type', origin.type);
        formData.append('origin_country', origin.country);
        formData.append('origin_address', origin.address);
        formData.append('destination_type', destination.type);
        formData.append('destination_country', destination.country);
        formData.append('destination_address', destination.address);
        formData.append('sender_company_name', 'na');
        formData.append('sender_company_address', 'na');
        formData.append('sender_eori_no', 'na');
        formData.append('sender_vat_no', 'na');
        formData.append('sender_contact_email', 'na');
        formData.append('sender_contact_number', 'na');
        formData.append('receiver_company_name', 'na');
        formData.append('receiver_company_address', 'na');
        formData.append('receiver_eori_no', 'na');
        formData.append('receiver_vat_no', 'na');
        formData.append('receiver_contact_email', 'na');
        formData.append('receiver_contact_no', 'na');
        formData.append('buyer_company_name', 'na');
        formData.append('buyer_company_address', 'na');
        formData.append('buyer_eori_no', 'na');
        formData.append('buyer_vat_no', 'na');
        formData.append('buyer_contact_email', 'na');
        formData.append('buyer_contact_no', 'na');
        formData.append('seller_company_name', 'na');
        formData.append('seller_company_address', 'na');
        formData.append('seller_eori_no', 'na');
        formData.append('seller_vat_no', 'na');
        formData.append('seller_contact_email', 'na');
        formData.append('seller_contact_number', 'na');
        attachments.forEach(file => formData.append('attachments', file));
        formData.append('doctype', doctype);
        formData.append('loads_units', loadsUnits);
        formData.append('loads_total_cbm', loadsTotalCbm);
        formData.append('loads_total_weight', loadsTotalWeight);
        formData.append('goods_value', goodsValue);
        formData.append('goods_ready', goodsReady);
        
        // Add custom clearance values
        formData.append('export_custom_clearance', customs.exportClearance.enabled ? customs.exportClearance.option : null);
        formData.append('import_custom_clearance', customs.importClearance.enabled ? customs.importClearance.option : null);
        
        // Retrieve token from localStorage
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://77.37.121.137:3000/api/user/order', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await response.json();
            if (data.order_id) {
                alert(`Order placed successfully! Order ID: ${data.order_id}`);
            } else {
                alert('Order failed!');
            }
        } catch (err) {
            alert('Error placing order: ' + err.message);
        }
    };

    return (
        <div className="shipment-details-form">
            <h2>Shipment Details (Shipment)</h2>

            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', margin: '24px 0' }}>
                <div>
                    <strong>Origin ✓</strong>
                    <div>
                        {origin.type || 'Type'} | {origin.country ? (
                            <>
                                <span className={`fi fi-${origin.country.toLowerCase().slice(0,2)}`}></span> {origin.country}
                            </>
                        ) : 'Country'}
                    </div>
                </div>
                <div>
                    <strong>Destination ✓</strong>
                    <div>
                        {destination.type || 'Type'} | {destination.country ? (
                            <>
                                <span className={`fi fi-${destination.country.toLowerCase().slice(0,2)}`}></span> {destination.country}
                            </>
                        ) : 'Country'}
                    </div>
                </div>
            </div>

            {/* Transport Mode */}
            <div className="section">
                <h3>Transport Mode</h3>
                <div className="radio-group">
                    {['Air Freight', 'Sea Freight', 'Road Freight'].map((mode) => (
                        <label key={mode} className="radio-option">
                            <input
                                type="radio"
                                name="transportMode"
                                value={mode}
                                checked={transportMode === mode}
                                onChange={() => setTransportMode(mode)}
                            />
                            <span>{mode}</span>
                        </label>
                    ))}
                </div>
            </div>


            {/* Type of Cargo */}
            <div>
                <h3>Type of Cargo</h3>
                <label>
                    <input
                        type="checkbox"
                        checked={cargoType.isFood}
                        onChange={(e) => setCargoType({ ...cargoType, isFood: e.target.checked })}
                    />
                    Food Product
                </label>
                <p style={{ color: 'red' }}>We do not deal with hazardous products.</p>
                <label>
                    Product Commodity Code *:
                    <input
                        type="text"
                        value={cargoType.commodityCode}
                        onChange={(e) => setCargoType({ ...cargoType, commodityCode: e.target.value })}
                    />
                </label>
                <label>
                    Good Description:
                    <input
                        type="text"
                        value={cargoType.description}
                        onChange={(e) => setCargoType({ ...cargoType, description: e.target.value })}
                    />
                </label>
                <label>
                    Invoice Value *:
                    <input
                        type="text"
                        value={cargoType.invoiceValue}
                        onChange={(e) => setCargoType({ ...cargoType, invoiceValue: e.target.value })}
                    />
                </label>
                <label>
                    Payment Incoterms *:
                    <select
                        value={cargoType.incoterms}
                        onChange={(e) => setCargoType({ ...cargoType, incoterms: e.target.value })}
                    >
                        <option value="">Select</option>
                        <option value="FOB">FOB</option>
                        <option value="CIF">CIF</option>
                        <option value="EXW">EXW</option>
                    </select>
                </label>
            </div>

            <Row>
                        <Col span={24}><Divider /></Col>
                    </Row>
            <Row>
                        <Col span={24}>
                            <div className='shipment-dropdown' >
                                <Row gutter={0}>
                                    <Col span={5}>
                                        <Dropdown className='dropdown'
                                            trigger={['click']}
                                            menu={{ items:[{key:1}]  }}
                                            dropdownRender={(menu) => (
                                                <div className='shipment-drawer'>
                                                    <FormOrigin
                                                        origin={origin}
                                                        setOrigin={setOrigin}
                                                        originTypeOptions={originTypeOptions}
                                                        countryOptions={countryOptions}
                                                    />
                                                </div>
                                            )}
                                            >
                                            <div className='wrapper' onClick={(e) => e.preventDefault()}>
                                                <strong className='title'>Origin</strong> <CheckOutlined /> <br/>
                                                {(origin.type || 'Type')} | {origin.country ? (
                                                    <>
                                                        <span className={`flag fi fi-${origin.country.toLowerCase().slice(0,2)}`}></span> {origin.country}
                                                    </>
                                                ) : 'Country'}
                                            </div>
                                        </Dropdown>
                                    </Col>
                                    <Col span={1}><Divider type="vertical" style={{height:'100%'}} /></Col>
                                    <Col span={5}>
                                        <Dropdown className='dropdown'
                                            trigger={['click']}
                                            menu={{ items:[{key:1}]  }}
                                            dropdownRender={(menu) => (
                                                <div className='shipment-drawer'>
                                                    <FormDestination
                                                        destination={destination}
                                                        setDestination={setDestination}
                                                        destinationTypeOptions={destinationTypeOptions}
                                                        countryOptions={countryOptions}
                                                    />
                                                </div>
                                            )}
                                            >
                                            <div className='wrapper' onClick={(e) => e.preventDefault()}>
                                                <strong className='title'>Destination</strong> <CheckOutlined /> <br/>
                                                {(destination.type || 'Type')} | {destination.country ? (
                                                    <>
                                                        <span className={`flag fi fi-${destination.country.toLowerCase().slice(0,2)}`}></span> {destination.country}
                                                    </>
                                                ) : 'Country'}
                                            </div>
                                        </Dropdown>                                        
                                    </Col>
                                    <Col span={1}><Divider type="vertical" style={{height:'100%'}} /></Col>
                                    <Col span={5}>
                                        <Dropdown className='dropdown'
                                            trigger={['click']}
                                            menu={{ items:[{key:1}]  }}
                                            dropdownRender={(menu) => (
                                                <div className='shipment-drawer'>
                                                    <FormLoads
                                                        loadsUnits={loadsUnits}
                                                        setLoadsUnits={setLoadsUnits}
                                                        loadsTotalCbm={loadsTotalCbm}
                                                        setLoadsTotalCbm={setLoadsTotalCbm}
                                                        loadsTotalWeight={loadsTotalWeight}
                                                        setLoadsTotalWeight={setLoadsTotalWeight}
                                                    />
                                                </div>
                                            )}
                                            >
                                            <div className='wrapper' onClick={(e) => e.preventDefault()}>
                                                <strong className='title'>Loads</strong> <CheckOutlined /> <br/>
                                                2 Units | Total : 0.02 cbm, 2kg
                                            </div>
                                        </Dropdown>
                                    </Col>
                                    <Col span={1}><Divider type="vertical" style={{height:'100%'}} /></Col>
                                    <Col span={6}>
                                        <Dropdown className='dropdown'
                                            trigger={['click']}
                                            menu={{ items:[{key:1}]  }}
                                            dropdownRender={(menu) => (
                                                <div className='shipment-drawer'>
                                                    <FormGoods
                                                        goodsValue={goodsValue}
                                                        setGoodsValue={setGoodsValue}
                                                        goodsReady={goodsReady}
                                                        setGoodsReady={setGoodsReady}
                                                    />
                                                </div>
                                            )}
                                            >
                                            <div className='wrapper' onClick={(e) => e.preventDefault()}>
                                                <strong className='title'>Goods</strong> <CheckOutlined /> <br/>
                                                $20,000 | Goods are ready
                                            </div>
                                        </Dropdown>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col span={24}><Divider /></Col>
                    </Row>

            {/* Temperature Controlled Goods */}
            <div>
                <h3>Temperature Controlled Goods</h3>
                <label>
                    <input
                        type="radio"
                        name="tempControlled"
                        value="yes"
                        checked={isTempControlled === true}
                        onChange={() => setIsTempControlled(true)}
                    />
                    Yes
                </label>
                <label>
                    <input
                        type="radio"
                        name="tempControlled"
                        value="no"
                        checked={isTempControlled === false}
                        onChange={() => setIsTempControlled(false)}
                    />
                    No
                </label>
                {isTempControlled && (
                    <div>
                        <label>
                            Min Temperature:
                            <input
                                type="text"
                                value={temperature.min}
                                onChange={(e) => setTemperature({ ...temperature, min: e.target.value })}
                            />
                        </label>
                        <label>
                            Max Temperature:
                            <input
                                type="text"
                                value={temperature.max}
                                onChange={(e) => setTemperature({ ...temperature, max: e.target.value })}
                            />
                        </label>
                    </div>
                )}
            </div>

            {/* Collection and Pickup */}
            {['Collection', 'Pickup'].map((section, i) => (
                <div key={section}>
                    <h3>{section}</h3>
                    {(i === 0 ? collection : pickup).map((item, index) => (
                        <div key={index}>
                            <label>
                                {section === 'Collection' ? 'Pickup Date' : 'Deliver Date'}:
                                <input
                                    type="date"
                                    value={item.date}
                                    onChange={(e) =>
                                        section === 'Collection'
                                            ? handleCollectionChange(index, 'date', e.target.value)
                                            : handlePickupChange(index, 'date', e.target.value)
                                    }
                                />
                            </label>
                            <label>
                                Forklift Required:
                                <input
                                    type="checkbox"
                                    checked={item.forklift}
                                    onChange={(e) =>
                                        section === 'Collection'
                                            ? handleCollectionChange(index, 'forklift', e.target.checked)
                                            : handlePickupChange(index, 'forklift', e.target.checked)
                                    }
                                />
                            </label>
                            <label>
                                Reference Text:
                                <input
                                    type="text"
                                    value={item.reference}
                                    onChange={(e) =>
                                        section === 'Collection'
                                            ? handleCollectionChange(index, 'reference', e.target.value)
                                            : handlePickupChange(index, 'reference', e.target.value)
                                    }
                                />
                            </label>
                            <label>
                                Type:
                                <input
                                    type="text"
                                    value={item.type}
                                    onChange={(e) =>
                                        section === 'Collection'
                                            ? handleCollectionChange(index, 'type', e.target.value)
                                            : handlePickupChange(index, 'type', e.target.value)
                                    }
                                />
                            </label>
                        </div>
                    ))}
                </div>
            ))}

            {/* Additional Services */}
            <div>
                <h3>Additional Services</h3>
                <label>
                    <input
                        type="checkbox"
                        checked={services.cargoInsurance}
                        onChange={(e) => setServices({ ...services, cargoInsurance: e.target.checked })}
                    />
                    Cargo Insurance
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={services.portCharges}
                        onChange={(e) => setServices({ ...services, portCharges: e.target.checked })}
                    />
                    Port Charges
                </label>
            </div>

            {/* Customs Services */}
            <div>
                <h3>Custom Services</h3>
                <label>
                    Export Customs Clearance:
                    <input
                        type="checkbox"
                        checked={customs.exportClearance.enabled}
                        onChange={(e) =>
                            setCustoms({ ...customs, exportClearance: { ...customs.exportClearance, enabled: e.target.checked } })
                        }
                    />
                    <select
                        value={customs.exportClearance.option}
                        onChange={(e) =>
                            setCustoms({ ...customs, exportClearance: { ...customs.exportClearance, option: e.target.value } })
                        }
                    >
                        <option value="">Select</option>
                        <option value="standard">Standard Clearance</option>
                        <option value="express">Express Clearance</option>
                    </select>
                </label>
                <label>
                    Import Customs Clearance:
                    <input
                        type="checkbox"
                        checked={customs.importClearance.enabled}
                        onChange={(e) =>
                            setCustoms({ ...customs, importClearance: { ...customs.importClearance, enabled: e.target.checked } })
                        }
                    />
                    <select
                        value={customs.importClearance.option}
                        onChange={(e) =>
                            setCustoms({ ...customs, importClearance: { ...customs.importClearance, option: e.target.value } })
                        }
                    >
                        <option value="">Select</option>
                        <option value="standard">Standard Clearance</option>
                        <option value="express">Express Clearance</option>
                    </select>
                </label>
            </div>

            {/* Attachments */}
            <div>
                <h3>Attachments</h3>
                <input type="file" multiple onChange={handleFileUpload} />
            </div>

            {/* Submit Button */}
            <button onClick={handleSubmit}>Submit Booking</button>
        </div>
    );
};


const FormOrigin = ({ origin, setOrigin, originTypeOptions, countryOptions }) => {
    return (
        <>
        <div style={{backgroundColor:'#efefef', padding: '20px',border: '1px gray solid' ,borderRadius: '24px'}}>
        <Row gutter={12}>
            <Col span={24}>
                <h2>Where are you shipping to?</h2>
            </Col>
            <Col span={8}>
                <label>Origin Type:</label>
                <select value={origin.type} onChange={e => setOrigin({ ...origin, type: e.target.value })} required>
                    <option value="">Select</option>
                    {originTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </Col>
            <Col span={8}>
                <label>Origin Country:</label>
                <select value={origin.country} onChange={e => setOrigin({ ...origin, country: e.target.value })} required>
                    <option value="">Select</option>
                    {countryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </Col>
            <Col span={8}>
                <label>Origin Address:</label>
                <input type="text" value={origin.address} onChange={e => setOrigin({ ...origin, address: e.target.value })} required />
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Divider style={{margin:'10px 0'}}/>
            </Col>
        </Row>
        </div>
        </>
    )
}



const FormDestination = ({ destination, setDestination, destinationTypeOptions, countryOptions }) => {
    return (
        <>
        <div style={{backgroundColor:'#efefef', padding: '20px',border: '1px gray solid' ,borderRadius: '24px'}}>
        <Row gutter={12}>
            <Col span={24}>
                <h2>Where are you shipping from?</h2>
            </Col>
            <Col span={8}>
                <label>Destination Type:</label>
                <select value={destination.type} onChange={e => setDestination({ ...destination, type: e.target.value })} required>
                    <option value="">Select</option>
                    {destinationTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </Col>
            <Col span={8}>
                <label>Destination Country:</label>
                <select value={destination.country} onChange={e => setDestination({ ...destination, country: e.target.value })} required>
                    <option value="">Select</option>
                    {countryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </Col>
            <Col span={8}>
                <label>Destination Address:</label>
                <input type="text" value={destination.address} onChange={e => setDestination({ ...destination, address: e.target.value })} required />
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Divider style={{margin:'10px 0'}}/>
            </Col>
        </Row>
        </div>
        </>
    )
}


const FormGoods = ({ goodsValue, setGoodsValue, goodsReady, setGoodsReady }) => {
    return (
        <>
        <div style={{backgroundColor:'#efefef', padding: '20px',border: '1px gray solid' ,borderRadius: '24px'}}>
        <Row gutter={12}>
            <Col span={24}>
                <h2>Tell us about your goods</h2>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <label>Good Value</label>
                <Form.Item
                    name="donation"
                    noStyle
                    rules={[{ required: true, message: 'Please input donation amount!' }]}
                >
                    <InputNumber addonAfter={
                        <Form.Item name="suffix" noStyle>
                        <Select style={{ width: 70 }}>
                          <Option value="USD">$</Option>
                          <Option value="CNY">¥</Option>
                        </Select>
                      </Form.Item>
                    } style={{ width: '100%' }} />
                </Form.Item>
            </Col>
        </Row>
        <Row>
            <Col style={{marginBottom:10}}>
                <Checkbox>Shipment contains hazardous goods Commercial only</Checkbox>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <label>Are your goods ready? </label>
                <Select
                      showSearch
                      placeholder="Country"
                      style={{ width: '100%' }} 
                      value={goodsReady}
                      onChange={value => setGoodsReady(value)}
                      options={[
                        { value: 'ready', label: 'Goods are ready' },
                        { value: 'not_ready', label: 'Goods are not ready' }
                      ]}
                    />
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Divider style={{margin:'10px 0'}}/>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Button type="primary">Submit</Button>
            </Col>
        </Row>
        </div>
        </>
    )
}

const FormLoads = ({ loadsUnits, setLoadsUnits, loadsTotalCbm, setLoadsTotalCbm, loadsTotalWeight, setLoadsTotalWeight }) => {
    
    const LooseCargo = ()=>{
        return (
            <>
            <div style={{backgroundColor:'#efefef', padding: '20px',border: '1px gray solid' ,borderRadius: '24px'}}>
            <Row gutter={[12,12]}>
                <Col span={24}>
                    <Radio.Group name="radiogroup" defaultValue={1}>
                        <Radio value={1}>Calculate by unit type</Radio>
                        <Radio value={2}>Calculate by total shipment</Radio>
                    </Radio.Group>
                </Col>

                <Col span={18}>
                    <span>Package type</span>
                    <Form.Item name="input-number" noStyle>
                        <Radio.Group  defaultValue="a" style={{display:'block', textAlign:'center'}} className='full-width'  >
                            <Radio.Button value="a">Pallets</Radio.Button>
                            <Radio.Button value="b">Box/Crates</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <span># of units</span>
                    <Form.Item name="input-number" noStyle >
                        <InputNumber min={1}  style={{width:'100%'}} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <label>Pallet type</label>
                    <Select
                        showSearch
                        placeholder="Pallet type"
                        style={{ width: '100%' }} 
                        value={loadsUnits}
                        onChange={value => setLoadsUnits(value)}
                        options={[
                            { value: 'Pallet', label: 'Pallet (non speficied size)' },
                        ]}
                        
                    />
                </Col>

                <Col span={18}>
                    <label>Dimensions (L×W×H per unit)</label>
                    <Form.Item>
                        <Space.Compact>
                            <Form.Item
                                name={['L','H','H']}
                                noStyle
                                rules={[{ required: true, message: 'Please input donation amount!' }]}
                                >
                                <InputNumber placeholder='L' style={{ width: '100%' }}/>
                            </Form.Item>
                            <Form.Item
                                name={['L','H','H']}
                                noStyle
                                rules={[{ required: true, message: 'Please input donation amount!' }]}
                                >
                                <InputNumber placeholder='W' style={{ width: '100%' }}/>
                            </Form.Item>
                            <Form.Item
                                name={['L','H','H']}
                                noStyle
                                rules={[{ required: true, message: 'Please input donation amount!' }]}
                                >
                                <InputNumber placeholder='H' addonAfter={
                                    <Form.Item name="suffix" noStyle>
                                        <Select style={{ width: 70 }}>
                                            <Option value="KG">KG</Option>
                                            <Option value="LB">LB</Option>
                                        </Select>
                                    </Form.Item>
                                } style={{ width: '100%' }} />
                            </Form.Item>
                        </Space.Compact>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <label>Weight (Per unit)</label>
                    <Form.Item
                        name="donation"
                        rules={[{ required: true, message: 'Please input donation amount!' }]}
                        >
                        <InputNumber addonAfter={
                            <Form.Item name="suffix" noStyle>
                                <Select style={{ width: 70 }}>
                                    <Option value="KG">KG</Option>
                                    <Option value="LB">LB</Option>
                                </Select>
                        </Form.Item>
                        } style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Divider style={{margin:'10px 0'}}/>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{textAlign:'right'}}>
                    <Button icon={<PlusOutlined />} >Add Another</Button> &nbsp;
                    <Button type="primary">Confirm</Button>
                </Col>
            </Row>
            </div>
            </>
        )
    }

    const Container = ()=>{
        return (
            <>
            <div style={{backgroundColor:'#efefef', padding: '20px',border: '1px gray solid' ,borderRadius: '24px'}}>
            <Row gutter={[12,12]}>
                <Col span={24}>
                <Alert 
                    message="Containers can be shipped to or from a business address only if there is a loading dock." 
                    type="info" 
                    showIcon 
                    icon={<ExclamationCircleOutlined />}
                />
                </Col>
                <Col span={6}>
                    <label># of units</label>
                    <Form.Item
                        name="donation"
                        rules={[{ required: true, message: 'Please input donation amount!' }]}
                        >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={18}>
                    <label>Container type</label>
                    <Form.Item name="input-number" noStyle>
                        <Radio.Group  defaultValue="a" style={{display:'block', textAlign:'center'}} className='quater-width'  >
                            <Radio.Button value="a">20'</Radio.Button>
                            <Radio.Button value="b">40'</Radio.Button>
                            <Radio.Button value="b">40' HC</Radio.Button>
                            <Radio.Button value="b">45' HC</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Checkbox>Overweight</Checkbox>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Divider style={{margin:'10px 0'}}/>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{textAlign:'right'}}>
                    <Button icon={<PlusOutlined />} >Add Another</Button> &nbsp;
                    <Button type="primary">Confirm</Button>
                </Col>
            </Row>
            </div>
            </>
        )
    }
    
    return (
        <>
        <div style={{backgroundColor:'#efefef', padding: '20px',border: '1px gray solid' ,borderRadius: '24px'}}>
        <Row gutter={12}>
            <Col span={24}>
                <Tabs style={{width:'700px'}}
                    defaultActiveKey="loose_cargo"
                    items = {[
                        {
                            key: 'loose_cargo',
                            label: "Loose Cargo",
                            children: <LooseCargo/>,
                            icon: <BorderTopOutlined />,
                        },
                        {
                            key: 'container',
                            label: Container,
                            children: <Container/>,
                            icon: <PicCenterOutlined />,
                        }
                    ]}
                />
            </Col>
        </Row>
        </div>
        </>
    )
}



export default ShipmentDetailsShipment;
