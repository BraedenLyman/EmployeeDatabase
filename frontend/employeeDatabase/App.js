/**
 * "StAuth10244: I Braeden Lyman, 000370695 certify that this material is my original work. 
 *  No other person's work has been used without due acknowledgement. 
 *  I have not made my work available to anyone else."
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert, Modal } from 'react-native';
import { DataTable, RadioButton } from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const API_URL = 'http://localhost:3001/api';

export default function App() {
  const [employee, setEmployees] = useState([]);
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  /**
   * Collection REST API's
   */

  // GET - fetch all employees in collection
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // POST - add employee to current collection
  const addEmployee = async () => {
    if (!fName || !lName || !age || !sex) {
      Alert.alert('Error', 'All fields must be filled out!');
      return;
    }
    try {
      await axios.post(API_URL, { fName, lName, age, sex });
      setFName('');
      setLName('');
      setAge('');
      setSex('');
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  // DELETE - delete entire collection
  const deleteCollection = async () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete all employees?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Proceed', 
          onPress: async () => {
            try {
              await axios.delete(API_URL);
              fetchEmployees();
            } catch (error) {
              console.error('Error deleting entire collection:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * Item REST API's
   */

  // GET - fetch employee by id
  const fetchEmployeeById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      const { fName, lName, age, sex } = response.data;
      setSelectedEmployee(response.data);
      setFName(fName); 
      setLName(lName); 
      setAge(age.toString());     
      setSex(sex);   
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching employee by ID:', error);
    }
  };

  // PUT - update existing employee by id
  const updateEmployee = async () => {
    if (!selectedEmployee) return; 
    try {
      await axios.put(`${API_URL}/${selectedEmployee.id}`, { fName, lName, age, sex });
      setFName('');
      setLName('');
      setAge('');
      setSex('');
      setSelectedEmployee(null);
      setIsModalVisible(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  // DELETE - delete employee by id
  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Close modal
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedEmployee(null);
    setFName('');
    setLName('');
    setAge('');
    setSex('');
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView style={styles.scrollView} >
        <View style={styles.container}>
          <Text style={styles.title}>Employee Manager</Text>
          <View style={styles.tableContainer}>
            <DataTable>
              <DataTable.Header style={styles.head}>
                <DataTable.Cell>ID</DataTable.Cell>
                <DataTable.Cell>First</DataTable.Cell>
                <DataTable.Cell>Last</DataTable.Cell>
                <DataTable.Cell>Age</DataTable.Cell>
                <DataTable.Cell>Sex</DataTable.Cell>
                <DataTable.Cell>Delete</DataTable.Cell>
                <DataTable.Cell>View</DataTable.Cell>
              </DataTable.Header>
            </DataTable>
            <ScrollView style={styles.scrollViewRow} >
              {employee && employee.length > 0 ? (
              employee.map((emp) => (
                <DataTable.Row key={emp.id} style={styles.row}>
                  <DataTable.Cell>{emp.id}</DataTable.Cell>
                  <DataTable.Cell>{emp.fName}</DataTable.Cell>
                  <DataTable.Cell>{emp.lName}</DataTable.Cell>
                  <DataTable.Cell>{emp.age}</DataTable.Cell>
                  <DataTable.Cell>{emp.sex}</DataTable.Cell>
                  <DataTable.Cell>
                    <TouchableOpacity onPress={() => deleteEmployee(emp.id)}>
                      <Icon name="trash" size={20} color="red" />
                    </TouchableOpacity>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <TouchableOpacity onPress={() => fetchEmployeeById(emp.id)}>
                      <Icon name="eye" size={20} color="green" />
                    </TouchableOpacity>
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ): (
              <Text style={styles.notFoundText}>No employees found.</Text>
            )}
            </ScrollView>
          </View>
          <View style={styles.inputContainer}>
            <TextInput 
              placeholder='First Name (John)' 
              placeholderTextColor={'white'}
              value={fName}
              onChangeText={setFName} 
              style={styles.input} 
            />
            <TextInput 
              placeholder='Last Name (Smith)' 
              placeholderTextColor={'white'}
              value={lName}
              onChangeText={setLName} 
              style={styles.input} 
            />
            <TextInput 
              placeholder='Age' 
              placeholderTextColor={'white'}
              value={age}
              onChangeText={setAge} 
              style={styles.input} 
              keyboardType='numeric'
            />
            <View style={styles.radioContainer}>
              <Text style={styles.radioText}>Sex:</Text>
              <RadioButton.Group
                onValueChange={newSex => setSex(newSex)}
                value={sex}
              >
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Item label="Male" value="M" labelStyle={styles.radioButtonLabel} />
                  <RadioButton.Item label="Female" value="F" labelStyle={styles.radioButtonLabel} />
                  <RadioButton.Item label="Other" value="O" labelStyle={styles.radioButtonLabel} />
                </View>
              </RadioButton.Group>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={addEmployee} style={styles.button}>
                <Text style={styles.buttonText}>Add Employee</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={deleteCollection} style={styles.button}>
                <Text style={styles.buttonText}>Delete All Employees</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Modal visible={isModalVisible} transparent={true} animationType="slide" onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {selectedEmployee && (
                  <>
                    <Text style={styles.modalTitle}>Employee Details / Edit</Text>
                      <View style={styles.modalView}>
                        <Text style={styles.modalText}>ID:</Text>
                        <Text style={styles.modalInput}>{selectedEmployee?.id}</Text>
                      </View>
                      <View style={styles.modalView}>
                        <Text style={styles.modalText}>First Name:</Text>
                        <TextInput 
                          placeholder='First Name (John)' 
                          placeholderTextColor={'white'}
                          value={fName}
                          onChangeText={setFName} 
                          style={styles.modalInput} 
                        />
                      </View>
                      <View style={styles.modalView}>
                        <Text style={styles.modalText}>Last Name:</Text>
                        <TextInput 
                          placeholder='Last Name (Smith)' 
                          placeholderTextColor={'white'}
                          value={lName}
                          onChangeText={setLName} 
                          style={styles.modalInput} 
                        />
                      </View>
                      <View style={styles.modalView}>
                        <Text style={styles.modalText}>Age:</Text>
                        <TextInput 
                          placeholder='Age' 
                          placeholderTextColor={'white'}
                          value={age}
                          onChangeText={setAge} 
                          style={styles.modalInput} 
                          keyboardType='numeric'
                        />
                      </View>
                      <View style={styles.radioContainer}>
                        <Text style={styles.radioText}>Sex:</Text>
                        <RadioButton.Group onValueChange={newSex => setSex(newSex)} value={sex} >
                          <View style={styles.radioButtonContainer}>
                            <RadioButton.Item label="Male" value="M" labelStyle={styles.radioButtonLabel} />
                            <RadioButton.Item label="Female" value="F" labelStyle={styles.radioButtonLabel} />
                            <RadioButton.Item label="Other" value="O" labelStyle={styles.radioButtonLabel} />
                          </View>
                        </RadioButton.Group>
                      </View>
                    <View style={styles.modalView}>
                      <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>Close</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={updateEmployee} style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>Save Changes</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 5,
    backgroundColor: '#030d14',
  },
  scrollView: {
    backgroundColor: '#030d14',
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    color: 'white',
  },
  tableContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },  
  head: { 
    height: 50, 
    backgroundColor: 'green',
  },
  row: { 
    height: 70, 
    backgroundColor: 'white', 
  },
  scrollViewRow: {
    maxHeight: 300,
  },
  notFoundText: {
    color: 'white', 
    textAlign: 'center'
  },
  inputContainer: {
    marginTop: 30,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  input: {
    borderWidth: 1, 
    borderColor: 'white',
    marginBottom: 10, 
    padding: 8,
    color: 'white',
  },
  buttonContainer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'green',
    height: 40,
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  radioContainer: {
    width: '100%',
  },
  radioText: {
    fontSize: 18,
    color: 'white',
    marginTop: 5,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,           
    borderColor: 'white',     
    borderRadius: 8, 
    padding: 3,   
    marginTop: 10,
    marginBottom: 10,  
  },
  radioButtonLabel: {
    color: 'white',
    fontSize: 11,
  },  

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#030d14',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
  modalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
    width: '40%',
  },
  modalInput: {
    borderBottomWidth: 1, 
    borderBottomColor: 'white',
    marginBottom: 10, 
    padding: 8,
    color: 'white',
    width: '55%',
  },
  modalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    width: 130,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 13,
    textAlign: 'center',
  },
});
