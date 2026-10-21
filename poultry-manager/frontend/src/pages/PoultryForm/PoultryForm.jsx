import { useState, useEffect } from 'react'
import styles from './PoultryForm.module.css'
import ChooseBtn from '../../components/Buttons/ChooseBtn.jsx'
import CancelBtn from '../../components/Buttons/CancelBtn.jsx'
import SaveBtn from '../../components/Buttons/SaveBtn.jsx'
import { useParams } from 'react-router'
import api from '../../api/axios.js'
import { useNavigate } from 'react-router'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const PoultryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState([])
  const [formData, setFormData] = useState({
    batchName: '',
    breed: '',
    birthday: '',
    cullingAge: '',
    total: '',
    active: '',
    image: null
  });

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    setIsSaving(true)
    try {
      await savePoultry(formData)
      navigate('/poultry')

    } catch (error) {
      const responseData = error.response?.data

      if (responseData?.messages) {
        setErrors(responseData.messages)
      } else if (responseData?.message) {
        setErrors([responseData.message])
      } else {
        setErrors(['Something went wrong. Please try again.'])
      }
    } finally {

      setIsSaving(false)
    }
  }
  const handleCancel = () => navigate('/poultry')

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  useEffect(() => {
    if (!id) return;

    const getPoultryById = async () => {
      try {
        const response = await api.get(`/poultry/${id}`)
        const existingData = response.data

        setFormData({
          batchName: existingData.batchName,
          breed: existingData.breed,
          birthday: existingData.birthday
            ? existingData.birthday.split("T")[0]
            : "",
          cullingAge: existingData.cullingAge,
          total: existingData.total,
          active: existingData.active,
          image: existingData.image
        });
      } catch (error) {
        console.error(error);
      }
    };

    getPoultryById();
  }, [id]);

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const savePoultry = async (formData) => {
    try {
      const formDataToSend = new FormData()

      formDataToSend.append('batchName', formData.batchName)
      formDataToSend.append('breed', formData.breed)
      formDataToSend.append('birthday', formData.birthday)
      formDataToSend.append('cullingAge', formData.cullingAge)
      formDataToSend.append('total', formData.total)
      formDataToSend.append('active', formData.active)

      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image)
      }

      console.log({
        batchName: formData.batchName,
        birthday: formData.birthday,
        total: formData.total,
        active: formData.active
      })

      if (id) {
        await api.put(`/poultry/${id}`, formDataToSend)
      } else {
        await api.post('/poultry', formDataToSend)
      }
    } catch (error) {
      console.error(error.response?.data || error.message)
      throw error
    }
  }

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  return (
    <div className={styles.wholeFormWrapper}>
      <h1>Poultry Form</h1>
      <br />
      <form onSubmit={handleSubmit}>
        {errors.length > 0 && (
          <div className={styles.errorMessages}>
            <p>Please correct the following errors:</p>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.uploadBox}>
          <div className={styles.upload}>
            <p><span className={styles.breedImageText}>Breed Image</span></p>
            <label
              className={styles.uploadArea}
              htmlFor='fileInput'
            >
              {formData.image ? (
                <img
                  className={styles.breedImage}
                  src={
                    typeof formData.image === 'string'
                      ? formData.image
                      : URL.createObjectURL(formData.image)
                  }
                  alt='Chicken Breed'
                />
              ) : (
                <div className={styles.dashedImage}>
                  <p><span className={styles.plusText}>+</span></p>
                </div>
              )}
            </label>
            <ChooseBtn
              className={styles.chooseBtn}
              htmlFor='fileInput'
            />
            <input
              id='fileInput'
              type='file'
              name='image'
              accept='image/*'
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            />
          </div>
        </div>

        <br />

        <label>
          Batch Name:
          <input
            className={styles.allInput}
            type='text'
            name='batchName'
            value={formData.batchName}
            onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
            placeholder='Flock-#001'
          />
        </label>

        <label>
          Breed:
          <input
            className={styles.allInput}
            type='text'
            name='breed'
            value={formData.breed}
            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
            placeholder='Rhode Island Red'
          />
        </label>

        <label>
          Birthday:
          <input
            className={styles.allInput}
            type='date'
            name='birthday'
            value={formData.birthday}
            onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
          />
        </label>

        <label>
          Culling Age (weeks):
          <input
            className={styles.allInput}
            type='number'
            name='cullingAge'
            value={formData.cullingAge}
            onChange={(e) => setFormData({ ...formData, cullingAge: e.target.value })}
            placeholder='162'
          />
        </label>

        <label>
          Total:
          <input
            className={styles.allInput}
            type='number'
            name='total'
            value={formData.total}
            onChange={(e) => setFormData({ ...formData, total: e.target.value })}
            placeholder='100'
          />
        </label>

        <label>
          Active:
          <input
            className={styles.allInput}
            type='number'
            name='active'
            value={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.value })}
            placeholder='100'
          />
        </label>

        <div className={styles.formActions}>
          <CancelBtn
            onClick={handleCancel}
            disabled={isSaving} />
          <SaveBtn
            disabled={isSaving}
            isSaving={isSaving} />
        </div>

      </form>
    </div>
  )
}

export default PoultryForm