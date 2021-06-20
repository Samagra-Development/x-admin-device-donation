/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  List,
  Create,
  Edit,
  Button,
  EditButton,
  SimpleList,
  Datagrid,
  TextField,
  BooleanField,
  ReferenceField,
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  SearchInput,
  BooleanInput,
  ReferenceInput,
  AutocompleteInput,
  RadioButtonGroupInput,
  FormDataConsumer,
  Filter,
  required,
  regex,
  choices,
  useQuery,
  useNotify,
  useRefresh,
  useUpdateMany,
  usePermissions,
  useUnselectAll,
} from 'react-admin';
import DeleteIcon from '@material-ui/icons/Delete';
import { useMediaQuery } from '@material-ui/core';
import EditNoDeleteToolbar from './EditNoDeleteToolbar';

// validation
const validatePhone = regex(/^\d{10}$/, 'Must be a valid phone number');
const validateGender = choices(
  ['M', 'F', 'N'],
  'Must be Male, Female or Other'
);

// school renderer
const schoolRenderer = (choice) => {
  return choice && `UDISE: ${choice.udise}, ${choice.name}`;
};

// student bult action
const StudentBulkActions = (props) => {
  const DeleteStudentsButton = ({ selectedIds }) => {
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const [updateMany, { loading }] = useUpdateMany(
      'student',
      selectedIds,
      { is_enabled: false },
      {
        onSuccess: () => {
          refresh();
          notify('Students deleted!');
          unselectAll('student');
        },
        onFailure: () => notify('Error: unable to delete students.', 'warning'),
      }
    );

    return (
      <Button label='Delete' disabled={loading} onClick={updateMany}>
        <DeleteIcon />
      </Button>
    );
  };
  return <DeleteStudentsButton {...props} />;
};

/**
 * Filter
 * @param {*} props
 */
const SearchFilter = (props) => {
  const { data } = useQuery({
    type: 'getList',
    resource: 'stream',
    payload: {
      pagination: {},
      sort: { field: 'tag', order: 'ASC' },
      filter: { distinctOnFields: ['tag'] },
    },
  });

  if (!data) return null;
  const tags = data.map((el) => {
    return {
      id: el.tag,
      name: el.tag,
    };
  });
  return (
    <Filter {...props}>
      <SearchInput
        placeholder='Search by Student Name'
        source='name'
        className='searchBar'
        alwaysOn
      />
      <ReferenceInput
        label='By School Name'
        source='school.id'
        reference='school'
        sort={{ field: 'name', order: 'ASC' }}
        filterToQuery={(searchText) => ({ name: searchText })}
        className='filterInput'
      >
        <AutocompleteInput optionText={schoolRenderer} />
      </ReferenceInput>
      <ReferenceInput
        label='By School UDISE'
        source='school.udise'
        reference='school'
        className='filterInput'
      >
        <TextInput source='udise' />
      </ReferenceInput>
      <SelectInput
        label='By Stream'
        source='stream_tag'
        choices={tags}
        className='filterInput'
      />
      <SelectInput
        label='By Grade Number'
        source='grade_number'
        choices={[
          { id: '1', name: '1' },
          { id: '2', name: '2' },
          { id: '3', name: '3' },
          { id: '4', name: '4' },
          { id: '5', name: '5' },
          { id: '6', name: '6' },
          { id: '7', name: '7' },
          { id: '8', name: '8' },
          { id: '9', name: '9' },
          { id: '10', name: '10' },
          { id: '11', name: '11' },
          { id: '12', name: '12' },
        ]}
        className='filterInput'
      />
      <SelectInput
        label='By Section'
        source='section'
        choices={[
          { id: 'A', name: 'A' },
          { id: 'B', name: 'B' },
          { id: 'C', name: 'C' },
          { id: 'D', name: 'D' },
          { id: 'E', name: 'E' },
          { id: 'F', name: 'F' },
        ]}
        className='filterInput'
      />
      <SelectInput
        label='By Category'
        source='category'
        choices={[
          { id: 'GE', name: 'GENERAL' },
          { id: 'OB', name: 'OBC' },
          { id: 'SC', name: 'SC' },
          { id: 'ST', name: 'ST' },
          { id: 'OT', name: 'OTHER' },
        ]}
        className='filterInput'
      />
      <SelectInput
        label='By Gender'
        source='gender'
        choices={[
          { id: 'M', name: 'Male' },
          { id: 'F', name: 'Female' },
          { id: 'N', name: 'None' },
        ]}
        className='filterInput'
      />
      <BooleanInput label='Is Enabled' source='is_enabled' />
      <BooleanInput label='Is CWSN' source='is_cwsn' />
    </Filter>
  );
};

/**
 * List all students
 * @param {*} props
 */
export const StudentList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  // eslint-disable-next-line no-shadow
  const CustomEditButton = (props) => (
    <EditButton
      style={{ marginLeft: '-20px', color: '#757575' }}
      {...props}
      label=''
    />
  );
  return (
    <List
      {...props}
      filters={<SearchFilter />}
      bulkActionButtons={<StudentBulkActions />}
      sort={{ field: 'id', order: 'DESC' }}
      filterDefaultValues={{ is_enabled: true }}
      className='customBox'
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record) =>
            `${record.name}, ${record.grade_number}, ${record.section}`
          }
          secondaryText={(record) => (
            <ReferenceField
              basePath='school'
              record={record}
              source='school_id'
              reference='school'
            >
              <TextField source='udise' />
            </ReferenceField>
          )}
          tertiaryText={(record) => `${record.stream_tag}, ${record.category}`}
          linkType='edit'
        />
      ) : (
        <Datagrid rowClick='edit'>
          <TextField source='id' />
          <TextField source='admission_number' />
          <TextField source='name' />
          <TextField source='grade_number' />
          <TextField source='section' />
          <ReferenceField label='School' source='school_id' reference='school'>
            <TextField source='udise' />
          </ReferenceField>
          <TextField source='stream_tag' />
          <TextField source='gender' />
          <TextField source='category' />
          <BooleanField source='is_cwsn' />
          <CustomEditButton {...props} label='Edit' />
        </Datagrid>
      )}
    </List>
  );
};

/**
 * Create new student
 * @param {*} props
 */
export const StudentCreate = (props) => (
  <Create {...props} className='customBox'>
    <SimpleForm>
      <TextInput
        label='Name'
        source='name'
        validate={[required()]}
        variant='outlined'
      />
      <TextInput
        label='Admission Number'
        source='admission_number'
        validate={[required()]}
        variant='outlined'
      />
      <ReferenceInput
        label='Search by School name'
        source='school_id'
        reference='school'
        sort={{ field: 'name', order: 'ASC' }}
        filterToQuery={(searchText) => ({ name: searchText })}
        allowEmpty
        variant='outlined'
      >
        <AutocompleteInput optionText={schoolRenderer} />
      </ReferenceInput>
      {/* <ReferenceInput
        label='School'
        source='school_id'
        reference='school'
        validate={[required()]}
        variant='outlined'
        perPage={100}
      >
        <SelectInput optionText='udise' />
      </ReferenceInput> */}
      <NumberInput
        label='Class'
        source='grade_number'
        validate={[required()]}
        variant='outlined'
      />
      <SelectInput
        label='Section'
        source='section'
        choices={[
          { id: 'A', name: 'A' },
          { id: 'B', name: 'B' },
          { id: 'C', name: 'C' },
          { id: 'D', name: 'D' },
          { id: 'E', name: 'E' },
          { id: 'F', name: 'F' },
        ]}
        validate={[required()]}
        variant='outlined'
      />
      <NumberInput
        label='Phone Number'
        source='phone'
        validate={[required(), validatePhone]}
        variant='outlined'
      />
      <NumberInput
        label='Roll No.'
        source='roll'
        validate={[required()]}
        variant='outlined'
      />
      <TextInput
        label='Father Name'
        source='father_name'
        validate={[required()]}
        variant='outlined'
      />
      <TextInput
        label='Mother Name'
        source='mother_name'
        validate={[required()]}
        variant='outlined'
      />
      <BooleanInput
        label='Is the student a child with special needs?'
        defaultValue={false}
        source='is_cwsn'
      />
      <BooleanInput
        label='Is the student active?'
        defaultValue
        style={{ display: 'none' }}
        source='is_enabled'
      />
      <RadioButtonGroupInput
        source='gender'
        choices={[
          { id: 'M', name: 'Male' },
          { id: 'F', name: 'Female' },
          { id: 'N', name: 'Other' },
        ]}
        validate={validateGender}
      />
      <TextInput source='previous_acad_year' initialValue='2019-2020' />
      <SelectInput
        label='Category'
        source='category'
        choices={[
          { id: 'GE', name: 'GENERAL' },
          { id: 'OB', name: 'OBC' },
          { id: 'SC', name: 'SC' },
          { id: 'ST', name: 'ST' },
          { id: 'OT', name: 'OTHER' },
        ]}
        validate={[required()]}
        variant='outlined'
      />
      <TextInput source='previous_grade' />
      <FormDataConsumer>
        {({ formData }) => {
          const grade = formData.grade_number;
          formData.previous_grade = grade - 1;
        }}
      </FormDataConsumer>
    </SimpleForm>
  </Create>
);

/**
 * Edit student details
 * @param {*} props
 */
export const StudentEdit = (props) => {
  const { loaded, permissions } = usePermissions();
  return (
    <Edit {...props} className='customBox'>
      <SimpleForm toolbar={<EditNoDeleteToolbar />}>
        <TextInput
          label='Name'
          source='name'
          validate={[required()]}
          variant='outlined'
        />
        <TextInput
          label='Admission Number'
          source='admission_number'
          validate={[required()]}
          variant='outlined'
        />
        <ReferenceInput
          label='Search by School name'
          source='school_id'
          reference='school'
          sort={{ field: 'name', order: 'ASC' }}
          filterToQuery={(searchText) => ({ name: searchText })}
          allowEmpty
          variant='outlined'
        >
          <AutocompleteInput optionText={schoolRenderer} />
        </ReferenceInput>
        <NumberInput
          label='Class'
          source='grade_number'
          validate={[required()]}
          variant='outlined'
        />
        <SelectInput
          label='Section'
          source='section'
          choices={[
            { id: 'A', name: 'A' },
            { id: 'B', name: 'B' },
            { id: 'C', name: 'C' },
            { id: 'D', name: 'D' },
            { id: 'E', name: 'E' },
            { id: 'F', name: 'F' },
          ]}
          variant='outlined'
        />
        <NumberInput
          label='Phone Number'
          source='phone'
          validate={[required(), validatePhone]}
          variant='outlined'
        />
        <NumberInput
          label='Roll No.'
          source='roll'
          validate={[required()]}
          variant='outlined'
        />
        <TextInput
          label='Father Name'
          source='father_name'
          validate={[required()]}
          variant='outlined'
        />
        <TextInput
          label='Mother Name'
          source='mother_name'
          validate={[required()]}
          variant='outlined'
        />
        <BooleanInput
          label='Is the student a child with special needs?'
          source='is_cwsn'
        />
        {/* <CheckboxGroupInput
        label="Is the student a child with special needs?"
        source="is_cwsn"
        choices={[{ id: "Is CWSN", name: "Is CWSN" }]}
      /> */}
        <RadioButtonGroupInput
          source='gender'
          choices={[
            { id: 'M', name: 'Male' },
            { id: 'F', name: 'Female' },
            { id: 'N', name: 'Other' },
          ]}
          validate={validateGender}
        />
        <SelectInput
          label='Category'
          source='category'
          choices={[
            { id: 'GE', name: 'GENERAL' },
            { id: 'OB', name: 'OBC' },
            { id: 'SC', name: 'SC' },
            { id: 'ST', name: 'ST' },
            { id: 'OT', name: 'OTHER' },
          ]}
          validate={[required()]}
          variant='outlined'
        />
        {loaded ? (
          permissions.Students &&
          permissions.Students.indexOf('delete') > -1 ? (
            <BooleanInput label='Is the student enabled?' source='is_enabled' />
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
        {/* <CheckboxGroupInput
        label="Is the student enabled?"
        source="is_enabled"
        choices={[{ id: "true", name: "Is Enabled" }]}
      /> */}
      </SimpleForm>
    </Edit>
  );
};
