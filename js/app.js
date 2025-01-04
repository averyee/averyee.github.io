new Vue({
    el: '#app',
    data: {
        subjects: SUBJECTS,
        loading: true,
        error: null
    },
    methods: {
        async startQuiz(subject) {
            try {
                localStorage.setItem('selectedSubject', subject.id);
                const response = await fetch(subject.dataFile);
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                localStorage.setItem('quizData', JSON.stringify(data));
                window.location.href = 'quiz.html';
            } catch (error) {
                console.error('加载题目数据失败:', error);
                alert('加载题目数据失败，请确保数据文件存在且格式正确');
            }
        },
        
        async loadQuestionCount() {
            try {
                this.loading = true;
                this.error = null;
                
                await Promise.all(this.subjects.map(async (subject) => {
                    try {
                        const response = await fetch(subject.dataFile);
                        const data = await response.json();
                        
                        if (data.questions && Array.isArray(data.questions)) {
                            subject.questionCount = data.questions.length;
                        }
                    } catch (error) {
                        console.error(`加载${subject.name}题目数量失败:`, error);
                    }
                }));
                
                this.loading = false;
            } catch (error) {
                this.error = '加载科目信息失败，请刷新页面重试';
                this.loading = false;
                console.error('加载题目数量失败:', error);
            }
        }
    },
    created() {
        this.loadQuestionCount();
    }
}); 