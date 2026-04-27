import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pydantic import BaseModel
import google.generativeai as genai
import os


class AssessmentResponse(BaseModel):
    assessment_name: str
    url: str
    description: str
    duration: str
    remote_testing_support: str
    adaptive_irt_support: str
    score: float

class SHLModel:
    def __init__(self, csv_path):
        df = pd.read_csv(csv_path).fillna("")
        self.df = df
        print(f"DEBUG: Loaded {len(df)} assessments from {csv_path}")

        fields = ["Name", "Description", "Duration", 
                  "Remote Testing Support", "Adaptive Support"]

        df["combined"] = df[fields].astype(str).agg(" ".join, axis=1)

        self.vectorizer = TfidfVectorizer()
        self.vectors = self.vectorizer.fit_transform(df["combined"])

    def enhance_query(self, query):
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"Enhance this query for better search relevance: {query}"

        try:
            resp = model.generate_content(prompt)
            return resp.text.strip()
        except:
            return query

    def recommend(self, query, k=5):
        better_query = self.enhance_query(query)
        q_vec = self.vectorizer.transform([better_query])

        scores = cosine_similarity(q_vec, self.vectors).flatten()
        self.df["score"] = scores

        top = self.df.nlargest(k, "score")

        output = []
        for _, row in top.iterrows():
            output.append({
                "assessment_name": row["Name"],
                "url": row["Link"],
                "description": row["Description"],
                "duration": row["Duration"],
                "remote_testing_support": row["Remote Testing Support"],
                "adaptive_irt_support": row["Adaptive Support"],
                "score": float(row["score"])
            })

        return output
