/* ========== PROJECTS DATA ==========
   Add / edit projects here. Each one becomes a slide in the Projects slider.
   Leave demo or github as "" to hide that button. */
const PROJECTS = [
  {
    img: "projects-1.png", type: "ML · Healthcare",
    title: "PCOD Risk <br> Screening System",
    points: [
      "MediSure: two-level ML system for quick symptom-based screening and advanced clinical assessment, built for a healthcare competition client project.",
      "Stratified 5-Fold CV: RBF-SVM reached 85.0% accuracy (ROC-AUC 89.5%); XGBoost reached 91.1% (ROC-AUC 96.1%).",
      "Deployed as a Streamlit app with automated BMI, lifestyle, lab and ultrasound inputs, risk scoring and safety disclaimers. Received 10,000 in a healthcare competition."
    ],
    tech: ["Python", "Scikit-learn", "SVM", "XGBoost", "Pandas", "Streamlit", "Model Evaluation"],
    demo: "https://medisure-pcos-prediction.streamlit.app/",
    github: "https://github.com/Sathvara-Amitkumar/PCOS_Prediction_System"
  },
  {
    img: "projects-2.png", type: "Backend",
    title: "FastAPI <br> Product Management",
    points: [
      "FastAPI-based Product Management API with CRUD, search, validation, pagination and RESTful endpoints on JSON storage.",
      "Streamlit dashboard for product management; backend and frontend deployed separately for live API interaction."
    ],
    tech: ["Python", "FastAPI", "REST API", "Pydantic", "Streamlit", "Pagination", "JSON"],
    demo: "https://fastapi-crud-app.streamlit.app/",
    github: "https://github.com/Sathvara-Amitkumar/FastAPI"
  },
  {
    img: "projects-3.png", type: "Deep Learning",
    title: "Iris Flower <br> Classification (ANN)",
    points: [
      "Feed-forward ANN in TensorFlow/Keras (ReLU + Softmax, Adam, categorical crossentropy) classifying Iris flowers into three species.",
      "96.67% test accuracy after hyperparameter tuning of epochs and batch size.",
      "Saved the model (.h5) and preprocessing pipeline (Joblib) for deployment and inference."
    ],
    tech: ["Python", "TensorFlow", "Keras", "Scikit-learn", "NumPy", "Streamlit"],
    demo: "https://iris-ann-classifier.streamlit.app/",
    github: "https://github.com/Sathvara-Amitkumar/ANN_DL"
  },
  {
    img: "projects-4.png", type: "Machine Learning",
    title: "Heart Disease <br> Prediction System",
    points: [
      "KNN model predicting heart disease risk from patient medical data.",
      "Data preprocessing, feature scaling, missing-value handling and EDA.",
      "88% test accuracy through optimized model parameters."
    ],
    tech: ["Python", "Pandas", "NumPy", "Scikit-learn", "Streamlit", "Data Cleanup"],
    demo: "https://heart-disease-predict-404.streamlit.app/",   // add your live demo link
    github: "https://github.com/Sathvara-Amitkumar/Heart-Disease-Prediction"  // add your GitHub repo link
  }
];
