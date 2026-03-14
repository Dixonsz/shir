import './MemberCard.css';

export default function MemberCard({ member }) {
    const defaultAvatar = 'https://ui-avatars.com/api/?name=' + 
        encodeURIComponent(`${member.first_name} ${member.last_name}`) + 
        '&background=333&color=fff&size=300';

    return (
        <div className="member-card">
            <div className="member-photo">
                <img 
                    src={member.photo_url || defaultAvatar} 
                    alt={`${member.first_name} ${member.last_name}`}
                    onError={(e) => {
                        e.target.src = defaultAvatar;
                    }}
                />
            </div>
            <div className="member-info">
                <h3 className="member-name">{member.first_name} {member.last_name}</h3>
                <p className="member-role">{member.rol?.name || 'Área de enfoque'}</p>
                {member.specialty && (
                    <p className="member-specialty">{member.specialty}</p>
                )}
            </div>
        </div>
    );
}











